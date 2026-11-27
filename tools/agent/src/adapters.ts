import fs from 'node:fs';
import path from 'node:path';
import {
  extractTestIdFromText,
  formatBriefAsMarkdown,
  formatBriefHeadline,
  NormalizedTestBrief,
  normalizeTag,
  splitListValues,
} from './briefs.js';
import { CommandResult, loadEnv, parseCliArgs, runCommand, writeErr, writeOut } from './utils.js';
import { createStyler, renderHeaderBox, renderTable, supportsColor, truncateText } from './ui.js';

export type AdapterSource = 'markdown' | 'csv' | 'json' | 'yaml' | 'github' | 'onspring';

export type OnspringFieldMap = {
  testId?: number;
  title?: number;
  domain?: number;
  tags?: number;
  actor?: number;
  fedRampSupport?: number;
  preconditions?: number;
  steps?: number;
  assertions?: number;
  cleanup?: number;
  notes?: number;
};

export type OnspringColumnMap = {
  testId?: string;
  title?: string;
  domain?: string;
  tags?: string;
  actor?: string;
  fedRampSupport?: string;
  preconditions?: string;
  steps?: string;
  assertions?: string;
  cleanup?: string;
  notes?: string;
};

export type OnspringFieldMappingConfig = {
  appId?: number;
  reportId?: number;
  fields?: OnspringFieldMap;
  columns?: OnspringColumnMap;
};

export type IngestOptions = {
  inputPath?: string;
  source?: AdapterSource;
  domainOverride?: string;
  issue?: string;
  label?: string;
  query?: string;
  repo?: string;
  limit?: number;
  onspringConfigPath?: string;
  appId?: number;
  recordId?: number;
  reportId?: number;
  filter?: string;
  fieldMapRaw?: string;
};

export type IngestDeps = {
  fetchFn?: typeof fetch;
  runGh?: (args: readonly string[], cwd: string) => Promise<CommandResult>;
};

const VALID_SOURCES: readonly AdapterSource[] = ['markdown', 'csv', 'json', 'yaml', 'github', 'onspring'];

const ONSPRING_FIELD_KEYS: readonly (keyof OnspringFieldMap)[] = [
  'testId',
  'title',
  'domain',
  'tags',
  'actor',
  'fedRampSupport',
  'preconditions',
  'steps',
  'assertions',
  'cleanup',
  'notes',
];

export function isValidAdapterSource(value: string): value is AdapterSource {
  return (VALID_SOURCES as readonly string[]).includes(value);
}

function stripBom(input: string): string {
  return input.replace(/^\uFEFF/, '');
}

function normalizeHeaderKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function firstNonEmptyString(...values: unknown[]): string | undefined {
  for (const val of values) {
    if (typeof val === 'string' && val.trim()) {
      return val.trim();
    }
    if (typeof val === 'number' && Number.isFinite(val)) {
      return String(val);
    }
  }
  return undefined;
}

function normalizeTagsList(raw: unknown): string[] | undefined {
  const parts = Array.isArray(raw)
    ? raw.map(v => String(v ?? '').trim())
    : typeof raw === 'string'
      ? raw.split(/[,;\r\n]+/)
      : [];

  const normalized = parts
    .map(normalizeTag)
    .filter(tag => tag.length > 1 && tag !== '@none' && tag !== '@n/a' && tag !== '@unspecified');

  if (normalized.length === 0) {
    return undefined;
  }

  return Array.from(new Set(normalized));
}

function pickField(map: Record<string, unknown>, aliases: readonly string[]): unknown {
  for (const alias of aliases) {
    const val = map[alias];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return val;
    }
  }
  return undefined;
}

function normalizeBriefRecord(rawObj: Record<string, unknown>, sourceLabel: string): NormalizedTestBrief {
  const normalized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(rawObj)) {
    normalized[normalizeHeaderKey(key)] = val;
  }

  const rawTitle = firstNonEmptyString(
    pickField(normalized, ['title', 'name', 'summary', 'testcase', 'scenario', 'description']),
    pickField(normalized, ['testid', 'id', 'key'])
  );
  if (!rawTitle) {
    throw new Error(`Unable to determine test title in record from ${sourceLabel}.`);
  }

  const rawTestId = firstNonEmptyString(pickField(normalized, ['testid', 'id', 'key']));
  const testId =
    (rawTestId ? (extractTestIdFromText(rawTestId) ?? rawTestId) : undefined) ?? extractTestIdFromText(rawTitle);

  const preconditions = splitListValues(pickField(normalized, ['preconditions', 'setup', 'seeddata']));
  const steps = splitListValues(pickField(normalized, ['steps', 'actions', 'procedure']));
  const assertions = splitListValues(
    pickField(normalized, ['assertions', 'expected', 'expectedassertions', 'expectedresult', 'expectedresults'])
  );

  const cleanTitle =
    testId && rawTitle.toLowerCase().startsWith(`${testId.toLowerCase()} `)
      ? rawTitle
          .slice(testId.length)
          .trim()
          .replace(/^[-:]\s*/, '')
      : rawTitle;

  const brief: NormalizedTestBrief = {
    title: cleanTitle || rawTitle,
    source: firstNonEmptyString(pickField(normalized, ['source'])) ?? sourceLabel,
  };

  if (testId) brief.testId = testId;
  const domain = firstNonEmptyString(pickField(normalized, ['domain', 'feature', 'featuredomain', 'area', 'module']));
  if (domain && !/^infer/i.test(domain)) brief.domain = domain.toLowerCase();

  const tags = normalizeTagsList(pickField(normalized, ['tags', 'labels']));
  if (tags) brief.tags = tags;

  const actor = firstNonEmptyString(pickField(normalized, ['actor', 'persona']));
  if (actor) brief.actor = actor;

  const fedRamp = firstNonEmptyString(pickField(normalized, ['fedrampsupport', 'fedramp']));
  if (fedRamp) brief.fedRampSupport = fedRamp;

  if (preconditions.length > 0) brief.preconditions = preconditions;
  if (steps.length > 0) brief.steps = steps;
  if (assertions.length > 0) brief.assertions = assertions;

  const cleanup = firstNonEmptyString(pickField(normalized, ['cleanup', 'teardown']));
  if (cleanup) brief.cleanup = cleanup;

  const notes = firstNonEmptyString(pickField(normalized, ['notes', 'description', 'details']));
  if (notes && notes !== brief.title) brief.notes = notes;

  return brief;
}

export function parseCsv(content: string): string[][] {
  const text = stripBom(content);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') {
        i++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

export function parseCsvBriefs(content: string, sourceLabel = 'csv'): NormalizedTestBrief[] {
  const rows = parseCsv(content);
  if (rows.length < 2) {
    throw new Error(`CSV input '${sourceLabel}' must contain a header row and at least one data row.`);
  }

  const headers = rows[0].map(h => h.trim());
  const briefs: NormalizedTestBrief[] = [];

  for (let idx = 1; idx < rows.length; idx++) {
    const cells = rows[idx];
    const rowObj: Record<string, string> = {};
    headers.forEach((header, colIdx) => {
      if (header) {
        rowObj[header] = (cells[colIdx] ?? '').trim();
      }
    });
    briefs.push(normalizeBriefRecord(rowObj, `${sourceLabel}#row-${idx}`));
  }

  return briefs;
}

function splitMarkdownSections(content: string): string[] {
  const lines = stripBom(content).split(/\r?\n/);
  const chunks: string[] = [];
  let current: string[] = [];
  let inFence = false;
  let seenHeader = false;

  const flush = (): void => {
    const text = current.join('\n').trim();
    if (text) {
      chunks.push(text);
    }
    current = [];
  };

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      current.push(line);
      continue;
    }

    if (!inFence && /^\s*---\s*$/.test(line)) {
      if (current.some(l => l.trim() !== '')) {
        flush();
        seenHeader = false;
      }
      continue;
    }

    if (!inFence && /^##\s+(?:Test Brief\b|Test-\d+\b)/i.test(line)) {
      if (seenHeader && current.some(l => l.trim() !== '')) {
        flush();
      }
      seenHeader = true;
    }

    current.push(line);
  }

  flush();
  return chunks;
}

function parseSingleMarkdownBrief(chunk: string, sourceLabel: string): NormalizedTestBrief {
  const lines = chunk.split(/\r?\n/);
  const metadata: Record<string, string> = {};
  const sections: Record<string, string[]> = {};
  let currentSection = '';
  let headingTitle = '';

  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2 && !/^test brief$/i.test(h2[1].trim())) {
      headingTitle = h2[1].trim();
      continue;
    }

    const h1 = /^#\s+(.+)$/.exec(line);
    if (h1 && !headingTitle && !/^test briefs?$/i.test(h1[1].trim())) {
      headingTitle = h1[1].trim();
      continue;
    }

    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      currentSection = normalizeHeaderKey(h3[1]);
      sections[currentSection] ??= [];
      continue;
    }

    const meta = /^\s*[-*]\s+\*\*([^*]+)\*\*\s*:\s*(.+)$/.exec(line);
    if (meta) {
      const key = normalizeHeaderKey(meta[1]);
      metadata[key] = meta[2].trim();
      continue;
    }

    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  const recordObj: Record<string, unknown> = { ...metadata };
  if (!recordObj.title && headingTitle) {
    recordObj.title = headingTitle;
  }

  for (const [secKey, secLines] of Object.entries(sections)) {
    const joined = secLines.join('\n').trim();
    if (!joined) continue;

    if (secKey.includes('precondition') || secKey.includes('seed')) {
      recordObj.preconditions = joined;
    } else if (secKey.includes('step')) {
      recordObj.steps = joined;
    } else if (secKey.includes('assert') || secKey.includes('expected')) {
      recordObj.assertions = joined;
    } else if (secKey.includes('cleanup')) {
      recordObj.cleanup = splitListValues(joined).join('; ') || joined;
    } else if (secKey.includes('note')) {
      recordObj.notes = joined;
    }
  }

  if (!recordObj.title) {
    const firstNonEmpty = lines.map(l => l.trim()).find(Boolean) ?? 'Test scenario';
    recordObj.title = firstNonEmpty.replace(/^[-*#]+\s*/, '');
  }

  const brief = normalizeBriefRecord(recordObj, sourceLabel);
  if (!brief.steps && !brief.assertions) {
    brief.rawText = chunk.trim();
  }
  return brief;
}

function cleanChecklistItemText(raw: string): string {
  return raw
    .trim()
    .replace(/^(?:[*_`]+)?(Test-\d+)(?:[*_`]+)?(?:\s*[-:]\s*|\s+)/i, (_m, id: string) => `${id} `)
    .trim();
}

type ExtractedTestChecklist = {
  hasTestChecklist: boolean;
  uncheckedItems: string[];
  checkedCount: number;
  contextLines: string[];
};

function extractTestChecklistItems(markdown: string): ExtractedTestChecklist {
  const lines = stripBom(markdown).split(/\r?\n/);
  const uncheckedItems: string[] = [];
  const contextLines: string[] = [];
  let checkedCount = 0;
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      contextLines.push(line);
      continue;
    }

    if (!inFence) {
      const match = /^\s*[-*]\s+\[([ xX])\]\s+(.+)$/.exec(line);
      if (match && extractTestIdFromText(match[2])) {
        if (match[1].trim() === '') {
          uncheckedItems.push(cleanChecklistItemText(match[2]));
        } else {
          checkedCount++;
        }
        continue;
      }
    }

    contextLines.push(line);
  }

  return {
    hasTestChecklist: uncheckedItems.length + checkedCount > 0,
    uncheckedItems,
    checkedCount,
    contextLines,
  };
}

export function parseMarkdownBriefs(content: string, sourceLabel = 'markdown'): NormalizedTestBrief[] {
  const chunks = splitMarkdownSections(content);
  if (chunks.length === 0) {
    throw new Error(`Markdown input '${sourceLabel}' contains no brief content.`);
  }

  if (chunks.length === 1) {
    const lines = chunks[0]
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);
    const hasMetaOrSubsections = lines.some(l => /^###\s+/.test(l) || /^\s*[-*]\s+\*\*[^*]+\*\*\s*:/.test(l));

    if (!hasMetaOrSubsections) {
      const checklist = extractTestChecklistItems(chunks[0]);
      if (checklist.hasTestChecklist) {
        if (checklist.uncheckedItems.length === 0) {
          throw new Error(`All Test-ID checklist items in '${sourceLabel}' are already checked.`);
        }
        const contextNotes = checklist.contextLines.join('\n').trim();
        return checklist.uncheckedItems.map((itemText, i) =>
          normalizeBriefRecord(
            { title: itemText, ...(contextNotes ? { notes: contextNotes } : {}) },
            `${sourceLabel}#item-${i + 1}`
          )
        );
      }
    }

    const bulletTests = lines.filter(l => /^[-*]\s+Test-\d+\b/i.test(l) || /^\d+[.)]\s+Test-\d+\b/i.test(l));

    if (!hasMetaOrSubsections && bulletTests.length > 1 && bulletTests.length === lines.length) {
      return bulletTests.map((line, i) => {
        const cleaned = line
          .replace(/^[-*]\s+/, '')
          .replace(/^\d+[.)]\s+/, '')
          .trim();
        return normalizeBriefRecord({ title: cleaned }, `${sourceLabel}#item-${i + 1}`);
      });
    }
  }

  return chunks.map((chunk, i) =>
    parseSingleMarkdownBrief(chunk, chunks.length === 1 ? sourceLabel : `${sourceLabel}#${i + 1}`)
  );
}

export function parseJsonBriefs(content: string, sourceLabel = 'json'): NormalizedTestBrief[] {
  const parsed = JSON.parse(stripBom(content)) as unknown;
  let items: unknown[];
  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.briefs)) {
      items = obj.briefs;
    } else if (Array.isArray(obj.tests)) {
      items = obj.tests;
    } else {
      items = [obj];
    }
  } else {
    throw new Error(`JSON input '${sourceLabel}' must be an object or array of brief objects.`);
  }

  return items.map((item, idx) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`JSON brief at index ${idx} in '${sourceLabel}' must be an object.`);
    }
    return normalizeBriefRecord(
      item as Record<string, unknown>,
      items.length === 1 ? sourceLabel : `${sourceLabel}#${idx + 1}`
    );
  });
}

function unquoteYamlScalar(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (trimmed.length >= 2 && trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

function stripYamlInlineComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle && line[i - 1] !== '\\') {
      inDouble = !inDouble;
    } else if (ch === '#' && !inSingle && !inDouble && (i === 0 || /\s/.test(line[i - 1]))) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
}

function parseSingleYamlDocument(docLines: string[]): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  let currentObj: Record<string, unknown> | null = null;
  let activeListKey: string | null = null;

  const flushCurrent = (): void => {
    if (currentObj && Object.keys(currentObj).length > 0) {
      results.push(currentObj);
    }
    currentObj = null;
    activeListKey = null;
  };

  for (let i = 0; i < docLines.length; i++) {
    const rawLine = docLines[i];
    const clean = stripYamlInlineComment(rawLine);
    if (!clean.trim()) {
      continue;
    }

    const indent = clean.length - clean.trimStart().length;
    const trimmed = clean.trim();

    if (indent === 0 && trimmed.startsWith('- ')) {
      flushCurrent();
      currentObj = {};
      const afterDash = trimmed.slice(2).trim();
      const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(afterDash);
      if (kv) {
        const [, k, v] = kv;
        if (v === '|' || v === '>') {
          const blockLines: string[] = [];
          let blockIndent = -1;
          while (i + 1 < docLines.length) {
            const nextRaw = docLines[i + 1];
            const nextTrim = nextRaw.trim();
            const nextIndent = nextRaw.length - nextRaw.trimStart().length;
            if (nextTrim === '') {
              blockLines.push('');
              i++;
              continue;
            }
            if (blockIndent < 0) {
              if (nextIndent <= indent) break;
              blockIndent = nextIndent;
            }
            if (nextIndent < blockIndent) break;
            blockLines.push(nextRaw.slice(blockIndent));
            i++;
          }
          currentObj[k] = blockLines.join(v === '>' ? ' ' : '\n').trim();
        } else if (v === '') {
          currentObj[k] = [];
          activeListKey = k;
        } else {
          currentObj[k] = unquoteYamlScalar(v);
        }
      }
      continue;
    }

    if (indent > 0 && trimmed.startsWith('- ') && currentObj && activeListKey) {
      const list = currentObj[activeListKey];
      if (Array.isArray(list)) {
        list.push(unquoteYamlScalar(trimmed.slice(2)));
      }
      continue;
    }

    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(trimmed);
    if (kv) {
      const [, k, v] = kv;
      if (!currentObj) {
        currentObj = {};
      }
      activeListKey = null;

      if (v === '|' || v === '>') {
        const blockLines: string[] = [];
        let blockIndent = -1;
        while (i + 1 < docLines.length) {
          const nextRaw = docLines[i + 1];
          const nextTrim = nextRaw.trim();
          const nextIndent = nextRaw.length - nextRaw.trimStart().length;
          if (nextTrim === '') {
            blockLines.push('');
            i++;
            continue;
          }
          if (blockIndent < 0) {
            if (nextIndent <= indent) break;
            blockIndent = nextIndent;
          }
          if (nextIndent < blockIndent) break;
          blockLines.push(nextRaw.slice(blockIndent));
          i++;
        }
        currentObj[k] = blockLines.join(v === '>' ? ' ' : '\n').trim();
      } else if (v.startsWith('[') && v.endsWith(']')) {
        currentObj[k] = v
          .slice(1, -1)
          .split(',')
          .map(part => unquoteYamlScalar(part))
          .filter(Boolean);
      } else if (v === '') {
        currentObj[k] = [];
        activeListKey = k;
      } else {
        currentObj[k] = unquoteYamlScalar(v);
      }
    }
  }

  flushCurrent();
  return results;
}

export function parseYamlBriefs(content: string, sourceLabel = 'yaml'): NormalizedTestBrief[] {
  const lines = stripBom(content).split(/\r?\n/);
  const docs: string[][] = [];
  let currentDoc: string[] = [];

  for (const line of lines) {
    if (/^\s*---\s*$/.test(line) || /^\s*\.\.\.\s*$/.test(line)) {
      if (currentDoc.some(l => l.trim() !== '' && !l.trim().startsWith('#'))) {
        docs.push(currentDoc);
      }
      currentDoc = [];
      continue;
    }
    currentDoc.push(line);
  }
  if (currentDoc.some(l => l.trim() !== '' && !l.trim().startsWith('#'))) {
    docs.push(currentDoc);
  }

  const objects: Record<string, unknown>[] = [];
  for (const doc of docs) {
    objects.push(...parseSingleYamlDocument(doc));
  }

  if (objects.length === 0) {
    throw new Error(`YAML input '${sourceLabel}' produced no brief objects.`);
  }

  return objects.map((obj, idx) =>
    normalizeBriefRecord(obj, objects.length === 1 ? sourceLabel : `${sourceLabel}#${idx + 1}`)
  );
}

type GitHubIssueJson = {
  number: number;
  title: string;
  body?: string;
  labels?: Array<{ name?: string } | string>;
  url?: string;
};

export async function fetchGitHubIssueBriefs(
  repoRoot: string,
  opts: IngestOptions,
  deps?: IngestDeps
): Promise<NormalizedTestBrief[]> {
  const runGh = deps?.runGh ?? ((args, cwd) => runCommand('gh', args, { cwd }));
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 20;

  let issues: GitHubIssueJson[];
  if (opts.issue) {
    const args = ['issue', 'view', opts.issue, ...(opts.repo ? ['--repo', opts.repo] : [])];
    args.push('--json', 'number,title,body,labels,url');
    const res = await runGh(args, repoRoot);
    if (res.exitCode !== 0) {
      throw new Error(`gh issue view failed: ${res.stderr || res.stdout}`);
    }
    issues = [JSON.parse(res.stdout) as GitHubIssueJson];
  } else {
    const args = [
      'issue',
      'list',
      '--state',
      'open',
      '--limit',
      String(limit),
      ...(opts.repo ? ['--repo', opts.repo] : []),
      ...(opts.label ? ['--label', opts.label] : []),
      ...(opts.query ? ['--search', opts.query] : []),
      '--json',
      'number,title,body,labels,url',
    ];
    const res = await runGh(args, repoRoot);
    if (res.exitCode !== 0) {
      throw new Error(`gh issue list failed: ${res.stderr || res.stdout}`);
    }
    issues = JSON.parse(res.stdout) as GitHubIssueJson[];
  }

  if (issues.length === 0) {
    throw new Error('No matching GitHub issues found.');
  }

  const results: NormalizedTestBrief[] = [];

  for (const issue of issues) {
    const sourceLabel = `github-issue#${issue.number}`;
    const bodyText = issue.body?.trim() ?? '';
    const parsedBody = bodyText ? parseSingleMarkdownBrief(bodyText, sourceLabel) : null;

    const labelNames = (issue.labels ?? [])
      .map(l => (typeof l === 'string' ? l : (l.name ?? '')))
      .map(s => s.trim())
      .filter(Boolean);

    let domainFromLabel: string | undefined;
    const tagList: string[] = [];
    for (const label of labelNames) {
      const domainMatch = /^(?:domain|area|feature):(.+)$/i.exec(label);
      if (domainMatch) {
        domainFromLabel = domainMatch[1].trim().toLowerCase();
        continue;
      }
      if (/^(?:not-?fedramp|@notfedramp|snapshot|@snapshot)$/i.test(label)) {
        tagList.push(normalizeTag(label));
      }
    }

    const mergedTags = Array.from(new Set([...(parsedBody?.tags ?? []), ...tagList]));
    const resolvedDomain = domainFromLabel ?? parsedBody?.domain;

    const checklist = bodyText ? extractTestChecklistItems(bodyText) : null;
    if (checklist?.hasTestChecklist) {
      if (checklist.uncheckedItems.length === 0) {
        if (opts.issue) {
          throw new Error(`All Test-ID checklist items in ${sourceLabel} are already checked.`);
        }
        continue;
      }

      const sharedNotes = [`Parent issue: ${issue.title.trim()}`, checklist.contextLines.join('\n').trim()]
        .filter(Boolean)
        .join('\n');

      checklist.uncheckedItems.forEach((itemText, idx) => {
        const itemBrief = normalizeBriefRecord({ title: itemText }, `${sourceLabel}#item-${idx + 1}`);
        results.push({
          ...itemBrief,
          ...(resolvedDomain ? { domain: resolvedDomain } : {}),
          ...(mergedTags.length > 0 ? { tags: mergedTags } : {}),
          ...(parsedBody?.actor ? { actor: parsedBody.actor } : {}),
          ...(parsedBody?.fedRampSupport ? { fedRampSupport: parsedBody.fedRampSupport } : {}),
          ...(parsedBody?.preconditions ? { preconditions: parsedBody.preconditions } : {}),
          ...(parsedBody?.cleanup ? { cleanup: parsedBody.cleanup } : {}),
          ...(issue.url ? { referenceUrl: issue.url } : {}),
          notes: sharedNotes,
        });
      });
      continue;
    }

    const titleTestId = extractTestIdFromText(issue.title);
    const bodyTestId = parsedBody?.testId ?? extractTestIdFromText(bodyText);
    const testId = titleTestId ?? bodyTestId;
    const cleanTitle =
      testId && issue.title.toLowerCase().startsWith(testId.toLowerCase())
        ? issue.title
            .slice(testId.length)
            .trim()
            .replace(/^[-:]\s*/, '')
        : issue.title.trim();

    results.push({
      ...(testId ? { testId } : {}),
      title: cleanTitle || issue.title.trim(),
      ...(resolvedDomain ? { domain: resolvedDomain } : {}),
      ...(mergedTags.length > 0 ? { tags: mergedTags } : {}),
      source: sourceLabel,
      ...(parsedBody?.actor ? { actor: parsedBody.actor } : {}),
      ...(parsedBody?.fedRampSupport ? { fedRampSupport: parsedBody.fedRampSupport } : {}),
      ...(parsedBody?.preconditions ? { preconditions: parsedBody.preconditions } : {}),
      ...(parsedBody?.steps ? { steps: parsedBody.steps } : {}),
      ...(parsedBody?.assertions ? { assertions: parsedBody.assertions } : {}),
      ...(parsedBody?.cleanup ? { cleanup: parsedBody.cleanup } : {}),
      ...(issue.url ? { referenceUrl: issue.url } : {}),
      ...(parsedBody?.notes ? { notes: parsedBody.notes } : {}),
      ...(bodyText ? { rawText: bodyText } : {}),
    });
  }

  if (results.length === 0) {
    throw new Error('No matching GitHub issues with unchecked test items found.');
  }

  return results;
}

function stripHtmlAndDecode(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r?\n\s*\n+/g, '\n')
    .trim();
}

function flattenOnspringValue(raw: unknown): unknown {
  if (raw === null || raw === undefined) {
    return undefined;
  }
  if (typeof raw === 'string') {
    return stripHtmlAndDecode(raw);
  }
  if (typeof raw === 'number' || typeof raw === 'boolean') {
    return String(raw);
  }
  if (Array.isArray(raw)) {
    return raw.map(item => flattenOnspringValue(item)).filter(v => v !== undefined && String(v).trim() !== '');
  }
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('name' in obj && obj.name !== undefined) {
      return flattenOnspringValue(obj.name);
    }
    if ('value' in obj && obj.value !== undefined) {
      return flattenOnspringValue(obj.value);
    }
    if ('text' in obj && obj.text !== undefined) {
      return flattenOnspringValue(obj.text);
    }
    return JSON.stringify(obj);
  }
  return undefined;
}

function parseFieldMapOverrides(raw: string): OnspringFieldMap {
  const result: OnspringFieldMap = {};
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) {
      throw new Error(`Invalid --field-map entry '${trimmed}'. Expected <key>=<fieldId>.`);
    }
    const rawKey = trimmed.slice(0, eqIdx).trim();
    const rawId = Number.parseInt(trimmed.slice(eqIdx + 1).trim(), 10);
    if (!Number.isFinite(rawId) || rawId <= 0) {
      throw new Error(`Invalid field ID in --field-map entry '${trimmed}'.`);
    }
    const matchedKey = ONSPRING_FIELD_KEYS.find(k => normalizeHeaderKey(k) === normalizeHeaderKey(rawKey));
    if (!matchedKey) {
      throw new Error(`Unknown field-map key '${rawKey}'. Allowed: ${ONSPRING_FIELD_KEYS.join(', ')}.`);
    }
    result[matchedKey] = rawId;
  }
  return result;
}

function buildOnspringV2BaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  return /\/v2$/i.test(trimmed) ? trimmed : `${trimmed}/v2`;
}

function resolveOnspringConfig(
  repoRoot: string,
  opts: IngestOptions,
  env: Record<string, string>
): OnspringFieldMappingConfig {
  const configPathArg = opts.onspringConfigPath ?? env.ONSPRING_CORP_CONFIG?.trim();
  let fileConfig: OnspringFieldMappingConfig = {};

  if (configPathArg) {
    const resolved = fs.existsSync(path.resolve(process.cwd(), configPathArg))
      ? path.resolve(process.cwd(), configPathArg)
      : path.resolve(repoRoot, configPathArg);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Onspring config file not found: '${configPathArg}'.`);
    }
    fileConfig = JSON.parse(stripBom(fs.readFileSync(resolved, 'utf8'))) as OnspringFieldMappingConfig;
  }

  const cliFieldMap = opts.fieldMapRaw ? parseFieldMapOverrides(opts.fieldMapRaw) : {};
  return {
    appId: opts.appId ?? fileConfig.appId,
    reportId: opts.reportId ?? fileConfig.reportId,
    fields: { ...(fileConfig.fields ?? {}), ...cliFieldMap },
    columns: { ...(fileConfig.columns ?? {}) },
  };
}

type OnspringFieldDataEntry = {
  fieldId: number;
  value?: unknown;
};

type OnspringRecordPayload = {
  appId?: number;
  recordId?: number;
  id?: number;
  fieldData?: OnspringFieldDataEntry[];
};

type OnspringQueryPayload = {
  pageNumber?: number;
  totalPages?: number;
  items?: OnspringRecordPayload[];
};

type OnspringReportPayload = {
  columns?: string[];
  rows?: Array<{ recordId?: number; cells?: unknown[] }>;
};

function recordPayloadToBrief(
  record: OnspringRecordPayload,
  fieldMap: OnspringFieldMap,
  fallbackAppId: number | undefined
): NormalizedTestBrief {
  const recordId = record.recordId ?? record.id ?? 0;
  const sourceLabel = `onspring-record#${recordId}`;
  const valueByFieldId = new Map<number, unknown>();

  for (const entry of record.fieldData ?? []) {
    valueByFieldId.set(entry.fieldId, flattenOnspringValue(entry.value));
  }

  const mapped: Record<string, unknown> = {};
  for (const key of ONSPRING_FIELD_KEYS) {
    const fid = fieldMap[key];
    if (fid !== undefined && valueByFieldId.has(fid)) {
      mapped[key] = valueByFieldId.get(fid);
    }
  }

  if (!mapped.testId && !mapped.title && valueByFieldId.size === 1) {
    mapped.title = Array.from(valueByFieldId.values())[0];
  }
  if (!mapped.testId && recordId > 0) {
    mapped.testId = `Record-${recordId}`;
  }

  const brief = normalizeBriefRecord(mapped, sourceLabel);
  if (fallbackAppId && !brief.notes) {
    brief.notes = `Onspring App ${fallbackAppId}, Record ${recordId}`;
  }
  return brief;
}

export async function fetchOnspringBriefs(
  repoRoot: string,
  opts: IngestOptions,
  deps?: IngestDeps
): Promise<NormalizedTestBrief[]> {
  const env = loadEnv(repoRoot);
  const apiUrlRaw = env.ONSPRING_CORP_API_URL?.trim();
  const apiKey = env.ONSPRING_CORP_API_KEY?.trim();

  if (!apiUrlRaw || !apiKey) {
    throw new Error(
      'ONSPRING_CORP_API_URL and ONSPRING_CORP_API_KEY must be configured in .env or environment to ingest Onspring records.'
    );
  }

  const config = resolveOnspringConfig(repoRoot, opts, env);
  const v2Base = buildOnspringV2BaseUrl(apiUrlRaw);
  const fetchFn = deps?.fetchFn ?? fetch;
  const headers: Record<string, string> = {
    'x-apikey': apiKey,
    'x-api-version': '2',
    accept: 'application/json',
  };

  if (opts.recordId !== undefined) {
    if (!config.appId) {
      throw new Error('Onspring single-record ingestion requires --app-id <id> or appId in --onspring-config.');
    }
    const url = `${v2Base}/records/appId/${config.appId}/recordId/${opts.recordId}?dataFormat=Formatted`;
    const res = await fetchFn(url, { method: 'GET', headers });
    if (!res.ok) {
      throw new Error(`Onspring API GET ${url} failed with HTTP ${res.status}.`);
    }
    const record = (await res.json()) as OnspringRecordPayload;
    return [recordPayloadToBrief(record, config.fields ?? {}, config.appId)];
  }

  if (config.reportId !== undefined) {
    const url = `${v2Base}/reports/id/${config.reportId}?apiDataFormat=ReportData&dataFormat=Formatted`;
    const res = await fetchFn(url, { method: 'GET', headers });
    if (!res.ok) {
      throw new Error(`Onspring API GET ${url} failed with HTTP ${res.status}.`);
    }
    const report = (await res.json()) as OnspringReportPayload;
    const columns = report.columns ?? [];
    const columnOverrides: Record<string, string> = {};
    for (const [k, v] of Object.entries(config.columns ?? {})) {
      if (v) {
        columnOverrides[normalizeHeaderKey(v)] = k;
      }
    }

    const limit = opts.limit && opts.limit > 0 ? opts.limit : Number.POSITIVE_INFINITY;
    const briefs: NormalizedTestBrief[] = [];
    for (const row of report.rows ?? []) {
      if (briefs.length >= limit) break;
      const obj: Record<string, unknown> = {};
      columns.forEach((colName, idx) => {
        const val = flattenOnspringValue((row.cells ?? [])[idx]);
        const mappedKey = columnOverrides[normalizeHeaderKey(colName)] ?? colName;
        obj[mappedKey] = val;
      });
      if (!obj.testId && !obj.id && row.recordId) {
        obj.testId = `Record-${row.recordId}`;
      }
      briefs.push(normalizeBriefRecord(obj, `onspring-report#${config.reportId}#${row.recordId ?? briefs.length + 1}`));
    }
    if (briefs.length === 0) {
      throw new Error(`Onspring report ${config.reportId} returned zero rows.`);
    }
    return briefs;
  }

  if (!config.appId) {
    throw new Error(
      'Onspring ingestion requires --record-id + --app-id, --app-id [--filter], or --report-id (or via --onspring-config).'
    );
  }

  const fieldIds = Array.from(
    new Set(Object.values(config.fields ?? {}).filter((id): id is number => typeof id === 'number' && id > 0))
  );
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 20;
  const briefs: NormalizedTestBrief[] = [];
  let pageNumber = 1;
  let totalPages = 1;

  while (pageNumber <= totalPages && briefs.length < limit) {
    const pageSize = Math.min(50, limit - briefs.length);
    const url = `${v2Base}/records/query?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const body = {
      appId: config.appId,
      ...(opts.filter ? { filter: opts.filter } : {}),
      ...(fieldIds.length > 0 ? { fieldIds } : {}),
      dataFormat: 'Formatted',
    };
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Onspring API POST ${url} failed with HTTP ${res.status}.`);
    }
    const payload = (await res.json()) as OnspringQueryPayload;
    totalPages = payload.totalPages ?? 1;
    const items = payload.items ?? [];
    if (items.length === 0) {
      break;
    }
    for (const item of items) {
      briefs.push(recordPayloadToBrief(item, config.fields ?? {}, config.appId));
      if (briefs.length >= limit) break;
    }
    pageNumber++;
  }

  if (briefs.length === 0) {
    throw new Error(`Onspring query against app ${config.appId} returned zero records.`);
  }
  return briefs;
}

function resolveFileSource(inputPath: string): AdapterSource {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext === '.csv') return 'csv';
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yaml';
  return 'markdown';
}

export async function ingestBriefs(
  repoRoot: string,
  opts: IngestOptions,
  deps?: IngestDeps
): Promise<NormalizedTestBrief[]> {
  let source = opts.source;

  if (!source) {
    if (opts.issue || opts.label || opts.query) {
      source = 'github';
    } else if (
      opts.recordId !== undefined ||
      opts.reportId !== undefined ||
      opts.appId !== undefined ||
      opts.onspringConfigPath ||
      opts.filter
    ) {
      source = 'onspring';
    } else if (opts.inputPath) {
      source = resolveFileSource(opts.inputPath);
    } else {
      throw new Error('Provide --input <file>, GitHub flags (--issue/--label/--query), or Onspring flags.');
    }
  }

  let briefs: NormalizedTestBrief[];
  if (source === 'github') {
    briefs = await fetchGitHubIssueBriefs(repoRoot, opts, deps);
  } else if (source === 'onspring') {
    briefs = await fetchOnspringBriefs(repoRoot, opts, deps);
  } else {
    if (!opts.inputPath) {
      throw new Error(`Source '${source}' requires --input <file>.`);
    }
    const resolved = fs.existsSync(path.resolve(process.cwd(), opts.inputPath))
      ? path.resolve(process.cwd(), opts.inputPath)
      : path.resolve(repoRoot, opts.inputPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Input file not found: '${opts.inputPath}'.`);
    }
    const content = fs.readFileSync(resolved, 'utf8');
    const relLabel = path.relative(repoRoot, resolved).replace(/\\/g, '/');

    if (source === 'csv') {
      briefs = parseCsvBriefs(content, relLabel);
    } else if (source === 'json') {
      briefs = parseJsonBriefs(content, relLabel);
    } else if (source === 'yaml') {
      briefs = parseYamlBriefs(content, relLabel);
    } else {
      briefs = parseMarkdownBriefs(content, relLabel);
    }
  }

  const domainOverride = opts.domainOverride?.trim().toLowerCase();
  if (domainOverride) {
    briefs = briefs.map(b => (b.domain ? b : { ...b, domain: domainOverride }));
  }

  return briefs;
}

export async function runIngestCommand(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--json', '--markdown']),
      options: new Set([
        '--input',
        '--source',
        '--domain',
        '--issue',
        '--label',
        '--query',
        '--repo',
        '--limit',
        '--onspring-config',
        '--app-id',
        '--record-id',
        '--report-id',
        '--filter',
        '--field-map',
      ]),
      maxPositionals: 0,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const sourceArg = parsed.options.get('--source')?.toLowerCase();
  if (sourceArg && !isValidAdapterSource(sourceArg)) {
    writeErr(`Invalid --source '${sourceArg}'. Expected: ${VALID_SOURCES.join(', ')}.`);
    return 2;
  }

  const parseIntOpt = (name: string): number | undefined => {
    const raw = parsed.options.get(name);
    if (raw === undefined) return undefined;
    const val = Number.parseInt(raw, 10);
    if (!Number.isFinite(val) || val <= 0) {
      throw new Error(`Invalid ${name} value '${raw}'. Expected a positive integer.`);
    }
    return val;
  };

  let briefs: NormalizedTestBrief[];
  try {
    briefs = await ingestBriefs(repoRoot, {
      inputPath: parsed.options.get('--input')?.trim(),
      source: sourceArg as AdapterSource | undefined,
      domainOverride: parsed.options.get('--domain')?.trim(),
      issue: parsed.options.get('--issue')?.trim(),
      label: parsed.options.get('--label')?.trim(),
      query: parsed.options.get('--query')?.trim(),
      repo: parsed.options.get('--repo')?.trim(),
      limit: parseIntOpt('--limit'),
      onspringConfigPath: parsed.options.get('--onspring-config')?.trim(),
      appId: parseIntOpt('--app-id'),
      recordId: parseIntOpt('--record-id'),
      reportId: parseIntOpt('--report-id'),
      filter: parsed.options.get('--filter')?.trim(),
      fieldMapRaw: parsed.options.get('--field-map')?.trim(),
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 1;
  }

  if (parsed.flags.has('--json')) {
    writeOut(JSON.stringify({ count: briefs.length, briefs }, null, 2));
    return 0;
  }

  if (parsed.flags.has('--markdown')) {
    writeOut(`# Ingested ${briefs.length} Test Brief(s)`);
    briefs.forEach((b, idx) => {
      writeOut();
      writeOut(`<!-- Brief ${idx + 1}: ${formatBriefHeadline(b)} -->`);
      writeOut(formatBriefAsMarkdown(b).trimEnd());
    });
    return 0;
  }

  const outColor = supportsColor(process.stdout);
  const s = createStyler(outColor);
  writeOut(
    renderHeaderBox(
      'Ingested Test Briefs',
      [
        { label: 'Count', value: `${briefs.length} brief(s)` },
        { label: 'Sources', value: Array.from(new Set(briefs.map(b => b.source.split('#')[0]))).join(', ') },
      ],
      { color: outColor }
    )
  );
  writeOut();
  writeOut(
    renderTable(
      ['#', 'Test ID', 'Title', 'Domain', 'Tags', 'Source'],
      briefs.map((b, idx) => [
        String(idx + 1),
        b.testId ? s.cyan(b.testId) : s.dim('-'),
        truncateText(b.title, 42),
        b.domain ?? s.dim('infer'),
        b.tags && b.tags.length > 0 ? b.tags.join(', ') : s.dim('none'),
        truncateText(b.source, 26),
      ]),
      { align: ['right', 'left', 'left', 'left', 'left', 'left'], color: outColor }
    )
  );
  writeOut();
  writeOut(s.dim('  Tip: pass --markdown for full brief details or --json for machine-readable output.'));
  return 0;
}
