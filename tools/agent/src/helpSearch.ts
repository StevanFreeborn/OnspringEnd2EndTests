import fs from 'node:fs';
import path from 'node:path';
import { loadEnv, parseCliArgs, walkFiles, writeErr, writeOut } from './utils.js';

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'to',
  'of',
  'in',
  'for',
  'on',
  'and',
  'or',
  'is',
  'it',
  'this',
  'that',
  'with',
  'as',
  'by',
  'be',
]);
const HEADING_RE = /^(#{1,4})\s+(.+?)\s*$/;
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(raw: string): { body: string; title: string; summary: string } {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) {
    return { body: raw, title: '', summary: '' };
  }

  const yaml = match[1];
  const titleMatch = /^title:\s*(.+)$/m.exec(yaml);
  const summaryMatch = /^summary:\s*(.+)$/m.exec(yaml);
  const unquote = (v: string | undefined): string => (v ? v.trim().replace(/^['"]|['"]$/g, '') : '');

  return {
    body: raw.slice(match[0].length).trimStart(),
    title: unquote(titleMatch?.[1]),
    summary: unquote(summaryMatch?.[1]),
  };
}

export type IndexedSection = {
  file: string;
  breadcrumb: string;
  content: string;
  length: number;
  tokenCounts: Map<string, number>;
  headingCounts: Map<string, number>;
};

export type RankedSection = {
  section: IndexedSection;
  score: number;
};

function tokenize(input: string): string[] {
  const matches = input.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return matches.filter(token => token.length >= 2 && !STOP_WORDS.has(token));
}

export function indexMarkdownSections(docsDir: string): IndexedSection[] {
  const files = walkFiles(docsDir, f => {
    const lower = f.toLowerCase();
    return lower.endsWith('.md') || lower.endsWith('.markdown');
  });

  const sections: IndexedSection[] = [];

  for (const file of files) {
    const rel = path.relative(docsDir, file).replace(/\\/g, '/');
    const raw = fs.readFileSync(file, 'utf8');
    const { body, title, summary } = parseFrontmatter(raw);
    const lines = body.split(/\r?\n/);
    const headings = ['', '', '', ''];
    let bodyLines: string[] = [];
    let breadcrumb = title || path.basename(file, path.extname(file));

    const flush = (): void => {
      const content = bodyLines.join('\n').trim();
      if (!content) return;
      const tokens = tokenize(content);
      if (tokens.length === 0) return;

      const tokenCounts = new Map<string, number>();
      for (const t of tokens) {
        tokenCounts.set(t, (tokenCounts.get(t) ?? 0) + 1);
      }

      const headingTokens = tokenize(`${rel} ${title} ${summary} ${breadcrumb}`);
      const headingCounts = new Map<string, number>();
      for (const t of headingTokens) {
        headingCounts.set(t, (headingCounts.get(t) ?? 0) + 1);
      }

      sections.push({
        file: rel,
        breadcrumb,
        content,
        length: tokens.length,
        tokenCounts,
        headingCounts,
      });
    };

    for (const line of lines) {
      const match = HEADING_RE.exec(line);
      if (match) {
        flush();
        bodyLines = [];

        const level = match[1].length;
        headings[level - 1] = match[2].trim();
        for (let j = level; j < headings.length; j++) {
          headings[j] = '';
        }

        const active = headings.filter(Boolean);
        breadcrumb = active.length > 0 ? active.join(' > ') : path.basename(file, path.extname(file));
      } else {
        bodyLines.push(line);
      }
    }

    flush();
  }

  return sections;
}

export function rankSections(sections: readonly IndexedSection[], query: string, top: number): RankedSection[] {
  const queryTokens = [...new Set(tokenize(query))];
  if (queryTokens.length === 0 || sections.length === 0) {
    return [];
  }

  const avgDocLen = sections.reduce((sum, s) => sum + s.length, 0) / sections.length || 1;
  const docFreq = new Map<string, number>();

  for (const qt of queryTokens) {
    let df = 0;
    for (const sec of sections) {
      if (sec.tokenCounts.has(qt) || sec.headingCounts.has(qt)) {
        df++;
      }
    }
    docFreq.set(qt, df);
  }

  const k1 = 1.5;
  const b = 0.75;
  const trimmedLower = query.trim().toLowerCase();
  const ranked: RankedSection[] = [];

  for (const sec of sections) {
    let score = 0;
    for (const qt of queryTokens) {
      const tf = sec.tokenCounts.get(qt) ?? 0;
      const headingTf = sec.headingCounts.get(qt) ?? 0;
      const combinedTf = tf + headingTf * 2;
      if (combinedTf <= 0) continue;

      const df = docFreq.get(qt) ?? 0;
      const idf = Math.log(1 + (sections.length - df + 0.5) / (df + 0.5));
      const norm = (combinedTf * (k1 + 1)) / (combinedTf + k1 * (1 - b + b * (sec.length / avgDocLen)));
      score += idf * norm;
    }

    if (score > 0) {
      if (sec.breadcrumb.toLowerCase().includes(trimmedLower) || sec.content.toLowerCase().includes(trimmedLower)) {
        score += 3;
      }
      ranked.push({ section: sec, score });
    }
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, top);
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}\n... [truncated]`;
}

export async function runHelpSearch(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--json']),
      options: new Set(['--docs-dir', '--top', '--max-chars']),
      maxPositionals: 10,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const query = parsed.positionals.join(' ').trim();
  if (!query) {
    writeErr('Error: Missing <query>. Example: npm run agent -- help-search "survey designer"');
    return 2;
  }

  const topRaw = parsed.options.get('--top') ?? '5';
  const top = Number.parseInt(topRaw, 10);
  if (!Number.isFinite(top) || top < 1) {
    writeErr(`Invalid --top value '${topRaw}'.`);
    return 2;
  }

  const maxCharsRaw = parsed.options.get('--max-chars') ?? '1200';
  const maxChars = Number.parseInt(maxCharsRaw, 10);
  if (!Number.isFinite(maxChars) || maxChars < 1) {
    writeErr(`Invalid --max-chars value '${maxCharsRaw}'.`);
    return 2;
  }

  const json = parsed.flags.has('--json');
  const env = loadEnv(repoRoot);
  const docsDir = parsed.options.get('--docs-dir')?.trim() || env.ONSPRING_HELP_DOCS_DIR?.trim() || '';

  if (!docsDir || !fs.existsSync(docsDir)) {
    const reason = !docsDir
      ? 'ONSPRING_HELP_DOCS_DIR is not set in environment or .env, and --docs-dir was not passed.'
      : `Configured help docs directory does not exist: '${docsDir}'.`;

    if (json) {
      writeOut(JSON.stringify({ configured: false, query, message: reason, results: [] }, null, 2));
    } else {
      writeOut(`Help Center docs not configured: ${reason}`);
      writeOut('Set ONSPRING_HELP_DOCS_DIR=/path/to/onspring-help-markdown in .env or pass --docs-dir <path>.');
    }
    return 0;
  }

  const sections = indexMarkdownSections(docsDir);
  const ranked = rankSections(sections, query, top);
  const results = ranked.map(item => ({
    file: item.section.file,
    breadcrumb: item.section.breadcrumb,
    score: Number(item.score.toFixed(3)),
    excerpt: truncate(item.section.content, maxChars),
  }));

  if (json) {
    writeOut(
      JSON.stringify(
        {
          configured: true,
          docsDir,
          query,
          totalSections: sections.length,
          results,
        },
        null,
        2
      )
    );
    return 0;
  }

  writeOut(`# Help Search: "${query}"`);
  writeOut(`Indexed ${sections.length} sections from \`${docsDir}\`.`);
  writeOut();

  if (results.length === 0) {
    writeOut('No matching Help Center sections found.');
    return 0;
  }

  results.forEach((r, idx) => {
    writeOut(`## ${idx + 1}. \`${r.file}\` — ${r.breadcrumb} (score: ${r.score.toFixed(2)})`);
    writeOut(r.excerpt);
    writeOut();
  });

  return 0;
}
