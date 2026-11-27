import { runCatalog } from './catalog.js';
import { runExplore } from './explore.js';
import { runHelpSearch } from './helpSearch.js';
import { findRepoRoot, writeErr, writeOut } from './utils.js';
import { runVerify } from './verify.js';

const HELP_TEXT = `onspring-agent — Harness-agnostic TypeScript CLI for exploring Onspring and authoring Screenplay E2E tests

Usage:
  npm run agent -- <command> [options]
  node tools/agent/dist/cli.js <command> [options]

Commands:
  catalog      List existing UI Targets/Tasks/Questions/Controls, Models, Fixtures, Tags, and Annotations
  help-search  Search local Onspring Help Center Markdown docs (ONSPRING_HELP_DOCS_DIR)
  explore      Ensure .auth/sysAdmin.json session and prepare/launch playwright-cli exploration
  verify       Run package build, unit tests, format, typecheck, ESLint, TS AST guardrails, and E2E verification

Run 'npm run agent -- <command> --help' for command-specific options.`;

const COMMAND_HELP: Record<string, string> = {
  catalog: `Usage:
  npm run agent -- catalog [--domain <filter>] [--kind all|targets|tasks|questions|controls|models|fixtures|tags] [--json]`,
  'help-search': `Usage:
  npm run agent -- help-search <query> [--docs-dir <path>] [--top <n>] [--max-chars <n>] [--json]`,
  explore: `Usage:
  npm run agent -- explore [--route <path>] [--refresh-auth] [--launch] [--session <name>] [--json]`,
  verify: `Usage:
  npm run agent -- verify [spec-path] [--skip-e2e] [--repeat <n>] [--browsers both|chrome|edge] [--json]`,
};

function isHelp(arg: string): boolean {
  return arg === '-h' || arg === '--help' || arg === 'help';
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || isHelp(argv[0])) {
    writeOut(HELP_TEXT);
    return 0;
  }

  const command = argv[0].toLowerCase();
  const rest = argv.slice(1);

  if (rest.some(isHelp)) {
    writeOut(COMMAND_HELP[command] ?? HELP_TEXT);
    return command in COMMAND_HELP ? 0 : 2;
  }

  const repoRoot = findRepoRoot();
  if (!repoRoot) {
    writeErr(
      'Error: Could not locate OnspringEnd2EndTests repository root (expected package.json and packages/onspring-ui/src/index.ts).'
    );
    return 1;
  }

  switch (command) {
    case 'catalog':
      return runCatalog(repoRoot, rest);
    case 'help-search':
      return runHelpSearch(repoRoot, rest);
    case 'explore':
      return runExplore(repoRoot, rest);
    case 'verify':
      return runVerify(repoRoot, rest);
    default:
      writeErr(`Unknown command: '${command}'.\n`);
      writeOut(HELP_TEXT);
      return 2;
  }
}

const exitCode = await main();
process.exit(exitCode);
