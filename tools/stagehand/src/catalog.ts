import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { parseCliArgs, toRepoRel, walkFiles, writeErr, writeOut } from './utils.js';

const VALID_KINDS = new Set(['all', 'targets', 'tasks', 'questions', 'controls', 'models', 'fixtures', 'tags']);

export type UiModuleEntry = {
  domain: string;
  kind: string;
  file: string;
  exports: string[];
  members: Record<string, string[]>;
};

export type ModelEntry = {
  file: string;
  symbols: string[];
};

export type ModelsSummary = {
  entities: ModelEntry[];
  testConstants: string[];
  fakeDataFactoryMethods: string[];
};

export type FixturesSummary = {
  builtInKeys: string[];
  builders: ModelEntry[];
};

export type TagsAndAnnotationsSummary = {
  tags: string[];
  annotations: string[];
};

export type CatalogPayload = {
  domainFilter: string | null;
  kind: string;
  uiModules: UiModuleEntry[];
  models: ModelsSummary;
  fixtures: FixturesSummary;
  tagsAndAnnotations: TagsAndAnnotationsSummary;
};

function hasExportModifier(node: ts.Node): boolean {
  return Boolean(ts.canHaveModifiers(node) && ts.getModifiers(node)?.some(m => m.kind === ts.SyntaxKind.ExportKeyword));
}

function unwrapInitializer(expr: ts.Expression): ts.Expression {
  let current: ts.Expression = expr;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function getPropertyNameText(nameNode: ts.PropertyName, sourceFile: ts.SourceFile): string {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text;
  }
  return nameNode.getText(sourceFile);
}

function parseExportsAndObjects(filePath: string): {
  exports: string[];
  objectMembers: Record<string, string[]>;
  sourceFile: ts.SourceFile;
} {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const exports: string[] = [];
  const seenExports = new Set<string>();
  const objectMembers: Record<string, string[]> = {};

  function addExport(name: string): void {
    if (name && !seenExports.has(name)) {
      seenExports.add(name);
      exports.push(name);
    }
  }

  for (const stmt of sourceFile.statements) {
    if (!hasExportModifier(stmt)) {
      continue;
    }

    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) {
          continue;
        }
        const varName = decl.name.text;
        addExport(varName);

        const unwrapped = decl.initializer ? unwrapInitializer(decl.initializer) : null;
        if (unwrapped && ts.isObjectLiteralExpression(unwrapped)) {
          const members: string[] = [];
          const seenMembers = new Set<string>();
          for (const prop of unwrapped.properties) {
            if (
              ts.isPropertyAssignment(prop) ||
              ts.isShorthandPropertyAssignment(prop) ||
              ts.isMethodDeclaration(prop) ||
              ts.isGetAccessorDeclaration(prop)
            ) {
              const memberName = getPropertyNameText(prop.name, sourceFile);
              if (memberName && !seenMembers.has(memberName)) {
                seenMembers.add(memberName);
                members.push(memberName);
              }
            }
          }
          objectMembers[varName] = members;
        }
      }
    } else if (
      (ts.isClassDeclaration(stmt) ||
        ts.isFunctionDeclaration(stmt) ||
        ts.isTypeAliasDeclaration(stmt) ||
        ts.isInterfaceDeclaration(stmt) ||
        ts.isEnumDeclaration(stmt)) &&
      stmt.name
    ) {
      addExport(stmt.name.text);
    }
  }

  return { exports, objectMembers, sourceFile };
}

function classifyUiFileKind(relFromUi: string): string {
  if (relFromUi.startsWith('common/controls/')) return 'controls';
  if (relFromUi.endsWith('.targets.ts')) return 'targets';
  if (relFromUi.endsWith('.tasks.ts')) return 'tasks';
  if (relFromUi.endsWith('.questions.ts')) return 'questions';
  return 'other';
}

function matchesFilter(filter: string | null, ...candidates: Array<string | readonly string[]>): boolean {
  if (!filter) return true;
  const needle = filter.toLowerCase();
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      if (candidate.some(item => item.toLowerCase().includes(needle))) return true;
    } else if (typeof candidate === 'string' && candidate.toLowerCase().includes(needle)) {
      return true;
    }
  }
  return false;
}

function scanUiModules(repoRoot: string, domainFilter: string | null, kind: string): UiModuleEntry[] {
  if (kind === 'models' || kind === 'fixtures' || kind === 'tags') {
    return [];
  }

  const uiSrc = path.join(repoRoot, 'packages', 'onspring-ui', 'src');
  const files = walkFiles(uiSrc, f => f.endsWith('.ts') && path.basename(f) !== 'index.ts');
  const entries: UiModuleEntry[] = [];

  for (const file of files) {
    const relFromUi = path.relative(uiSrc, file).replace(/\\/g, '/');
    const fileKind = classifyUiFileKind(relFromUi);
    if (kind !== 'all' && kind !== fileKind) {
      continue;
    }

    const domain = relFromUi.includes('/') ? relFromUi.slice(0, relFromUi.lastIndexOf('/')) : 'root';
    const { exports, objectMembers } = parseExportsAndObjects(file);

    if (!matchesFilter(domainFilter, domain, relFromUi, exports)) {
      continue;
    }

    entries.push({
      domain,
      kind: fileKind,
      file: toRepoRel(repoRoot, file),
      exports,
      members: objectMembers,
    });
  }

  return entries;
}

function scanModels(repoRoot: string, domainFilter: string | null, kind: string): ModelsSummary {
  if (kind !== 'all' && kind !== 'models') {
    return { entities: [], testConstants: [], fakeDataFactoryMethods: [] };
  }

  const modelsDir = path.join(repoRoot, 'packages', 'onspring-models', 'src', 'models');
  const entities: ModelEntry[] = [];

  for (const file of walkFiles(modelsDir, f => f.endsWith('.ts') && path.basename(f) !== 'index.ts')) {
    const rel = toRepoRel(repoRoot, file);
    const { exports } = parseExportsAndObjects(file);
    if (exports.length > 0 && matchesFilter(domainFilter, rel, exports)) {
      entities.push({ file: rel, symbols: exports });
    }
  }

  const testConstants: string[] = [];
  const fakeDataFactoryMethods: string[] = [];
  const factoryPath = path.join(repoRoot, 'packages', 'onspring-models', 'src', 'factories', 'fakeDataFactory.ts');
  if (fs.existsSync(factoryPath)) {
    const { exports, sourceFile } = parseExportsAndObjects(factoryPath);
    for (const sym of exports) {
      if (sym.startsWith('TEST_') && matchesFilter(domainFilter, sym)) {
        testConstants.push(sym);
      }
    }

    for (const stmt of sourceFile.statements) {
      if (ts.isClassDeclaration(stmt) && stmt.name?.text === 'FakeDataFactory') {
        for (const member of stmt.members) {
          const isStatic = Boolean(
            ts.canHaveModifiers(member) && ts.getModifiers(member)?.some(m => m.kind === ts.SyntaxKind.StaticKeyword)
          );
          if (!isStatic || !member.name) continue;
          if (ts.isMethodDeclaration(member) || ts.isGetAccessorDeclaration(member)) {
            const name = getPropertyNameText(member.name, sourceFile);
            if (matchesFilter(domainFilter, name)) {
              fakeDataFactoryMethods.push(name);
            }
          }
        }
      }
    }
  }

  return { entities, testConstants, fakeDataFactoryMethods };
}

function scanFixtures(repoRoot: string, domainFilter: string | null, kind: string): FixturesSummary {
  if (kind !== 'all' && kind !== 'fixtures') {
    return { builtInKeys: [], builders: [] };
  }

  const fixturesDir = path.join(repoRoot, 'fixtures');
  const builtInKeys: string[] = [];
  const indexPath = path.join(fixturesDir, 'index.ts');

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const sourceFile = ts.createSourceFile(indexPath, content, ts.ScriptTarget.Latest, true);
    for (const stmt of sourceFile.statements) {
      if (ts.isTypeAliasDeclaration(stmt) && stmt.name.text === 'Fixtures' && ts.isTypeLiteralNode(stmt.type)) {
        for (const member of stmt.type.members) {
          if (ts.isPropertySignature(member) && member.name) {
            const key = getPropertyNameText(member.name, sourceFile);
            if (matchesFilter(domainFilter, key)) {
              builtInKeys.push(key);
            }
          }
        }
      }
    }
  }

  const builders: ModelEntry[] = [];
  for (const file of walkFiles(fixturesDir, f => path.dirname(f) === fixturesDir && f.endsWith('.fixtures.ts'))) {
    const rel = toRepoRel(repoRoot, file);
    const { exports } = parseExportsAndObjects(file);
    if (exports.length > 0 && matchesFilter(domainFilter, rel, exports)) {
      builders.push({ file: rel, symbols: exports });
    }
  }

  return { builtInKeys, builders };
}

function scanTagsAndAnnotations(
  repoRoot: string,
  domainFilter: string | null,
  kind: string
): TagsAndAnnotationsSummary {
  if (kind !== 'all' && kind !== 'tags') {
    return { tags: [], annotations: [] };
  }

  const tags: string[] = [];
  const annotations: string[] = [];

  const tagsPath = path.join(repoRoot, 'tests', 'tags.ts');
  if (fs.existsSync(tagsPath)) {
    const { objectMembers } = parseExportsAndObjects(tagsPath);
    for (const [obj, members] of Object.entries(objectMembers)) {
      for (const m of members) {
        if (matchesFilter(domainFilter, m)) {
          tags.push(`${obj}.${m}`);
        }
      }
    }
  }

  const annPath = path.join(repoRoot, 'tests', 'annotations.ts');
  if (fs.existsSync(annPath)) {
    const { objectMembers } = parseExportsAndObjects(annPath);
    for (const [obj, members] of Object.entries(objectMembers)) {
      for (const m of members) {
        if (matchesFilter(domainFilter, m)) {
          annotations.push(`${obj}.${m}`);
        }
      }
    }
  }

  return { tags, annotations };
}

function printMarkdownCatalog({
  domainFilter,
  kind,
  uiModules,
  models,
  fixtures,
  tagsAndAnnotations,
}: CatalogPayload): void {
  writeOut('# Onspring Screenplay Catalog');
  if (domainFilter || kind !== 'all') {
    writeOut(`Filters: domain=\`${domainFilter ?? '*'}\` kind=\`${kind}\``);
  }
  writeOut();

  if (uiModules.length > 0) {
    writeOut('## UI Building Blocks (`@stevanfreeborn/onspring-ui`)');
    const grouped = new Map<string, UiModuleEntry[]>();
    for (const mod of uiModules) {
      const list = grouped.get(mod.domain) ?? [];
      list.push(mod);
      grouped.set(mod.domain, list);
    }

    for (const domain of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
      writeOut(`### \`${domain}\``);
      for (const mod of grouped.get(domain) ?? []) {
        writeOut(`- \`${mod.file}\` (${mod.kind})`);
        for (const [objName, members] of Object.entries(mod.members)) {
          const text = members.length > 0 ? members.join(', ') : '(empty object)';
          writeOut(`  - \`${objName}\`: ${text}`);
        }
        const nonObjects = mod.exports.filter(exp => !(exp in mod.members));
        if (nonObjects.length > 0) {
          writeOut(`  - Exports: ${nonObjects.join(', ')}`);
        }
      }
    }
    writeOut();
  }

  if (models.entities.length > 0 || models.testConstants.length > 0 || models.fakeDataFactoryMethods.length > 0) {
    writeOut('## Domain Models & Data Generators (`@stevanfreeborn/onspring-models`)');
    for (const entity of models.entities) {
      writeOut(`- \`${entity.file}\`: ${entity.symbols.join(', ')}`);
    }
    if (models.testConstants.length > 0) {
      writeOut(`- \`TEST_*\` constants: ${models.testConstants.join(', ')}`);
    }
    if (models.fakeDataFactoryMethods.length > 0) {
      writeOut(`- \`FakeDataFactory\`: ${models.fakeDataFactoryMethods.join(', ')}`);
    }
    writeOut();
  }

  if (fixtures.builtInKeys.length > 0 || fixtures.builders.length > 0) {
    writeOut('## Fixtures (`fixtures/index.ts`)');
    if (fixtures.builtInKeys.length > 0) {
      writeOut(`- Built-in test fixtures: ${fixtures.builtInKeys.join(', ')}`);
    }
    for (const builder of fixtures.builders) {
      writeOut(`- \`${builder.file}\`: ${builder.symbols.join(', ')}`);
    }
    writeOut();
  }

  if (tagsAndAnnotations.tags.length > 0 || tagsAndAnnotations.annotations.length > 0) {
    writeOut('## Tags & Annotations (`tests/`)');
    if (tagsAndAnnotations.tags.length > 0) {
      writeOut(`- \`Tags\`: ${tagsAndAnnotations.tags.join(', ')}`);
    }
    if (tagsAndAnnotations.annotations.length > 0) {
      writeOut(`- \`AnnotationType\`: ${tagsAndAnnotations.annotations.join(', ')}`);
    }
  }
}

export function buildCatalog(repoRoot: string, domainFilter: string | null = null, kind = 'all'): CatalogPayload {
  const uiModules = scanUiModules(repoRoot, domainFilter, kind);
  const models = scanModels(repoRoot, domainFilter, kind);
  const fixtures = scanFixtures(repoRoot, domainFilter, kind);
  const tagsAndAnnotations = scanTagsAndAnnotations(repoRoot, domainFilter, kind);

  return {
    domainFilter,
    kind,
    uiModules,
    models,
    fixtures,
    tagsAndAnnotations,
  };
}

export async function runCatalog(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--json']),
      options: new Set(['--domain', '--kind']),
      maxPositionals: 0,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const domainFilter = parsed.options.get('--domain') ?? null;
  const kind = (parsed.options.get('--kind') ?? 'all').toLowerCase();
  if (!VALID_KINDS.has(kind)) {
    writeErr(`Invalid --kind '${kind}'. Expected one of: ${[...VALID_KINDS].join(', ')}.`);
    return 2;
  }

  const json = parsed.flags.has('--json');
  const payload = buildCatalog(repoRoot, domainFilter, kind);

  if (json) {
    writeOut(JSON.stringify(payload, null, 2));
    return 0;
  }

  printMarkdownCatalog(payload);
  return 0;
}
