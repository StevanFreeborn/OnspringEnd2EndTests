import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

export type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
  seconds: number;
};

export type RunCommandOptions = {
  cwd?: string;
  extraEnv?: Record<string, string>;
  onStdout?: (chunk: string) => void;
  onStderr?: (chunk: string) => void;
};

export type CliArgSchema = {
  flags?: Set<string>;
  options?: Set<string>;
  maxPositionals?: number;
};

export type ParsedCliArgs = {
  flags: Set<string>;
  options: Map<string, string>;
  positionals: string[];
};

/**
 * Write a line to stdout without triggering ESLint `no-console`.
 */
export function writeOut(line = ''): void {
  process.stdout.write(`${line}\n`);
}

/**
 * Write a line to stderr without triggering ESLint `no-console`.
 */
export function writeErr(line = ''): void {
  process.stderr.write(`${line}\n`);
}

/**
 * Walk upward from cwd (falling back to this module's directory) until locating the repo root.
 */
export function findRepoRoot(): string | null {
  const candidates = [process.cwd(), path.dirname(fileURLToPath(import.meta.url))];

  for (const start of candidates) {
    let current = path.resolve(start);
    while (true) {
      const hasPackageJson = fs.existsSync(path.join(current, 'package.json'));
      const hasUiIndex = fs.existsSync(path.join(current, 'packages', 'onspring-ui', 'src', 'index.ts'));
      if (hasPackageJson && hasUiIndex) {
        return current;
      }

      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }
      current = parent;
    }
  }

  return null;
}

/**
 * Load `.env` from repoRoot merged with `process.env` (`process.env` takes precedence).
 */
export function loadEnv(repoRoot: string): Record<string, string> {
  const envPath = path.join(repoRoot, '.env');
  const parsed = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath, 'utf8')) : {};
  const merged: Record<string, string> = { ...parsed };

  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }

  return merged;
}

/**
 * Convert an absolute path to a forward-slash repo-relative path.
 */
export function toRepoRel(repoRoot: string, fullPath: string): string {
  return path.relative(repoRoot, fullPath).replace(/\\/g, '/');
}

/**
 * Recursively walk a directory and return sorted file paths matching `predicate`.
 */
export function walkFiles(dir: string, predicate: (filePath: string) => boolean = () => true): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results: string[] = [];
  const stack: string[] = [dir];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  results.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  return results;
}

function needsWindowsShell(command: string): boolean {
  if (process.platform !== 'win32') {
    return false;
  }
  const lower = command.toLowerCase();
  return (
    lower === 'npm' ||
    lower === 'npx' ||
    lower === 'playwright-cli' ||
    lower === 'opencode' ||
    lower === 'pi' ||
    lower === 'claude' ||
    lower === 'codex' ||
    lower.endsWith('.cmd') ||
    lower.endsWith('.bat')
  );
}

function quoteCmdArg(value: string): string {
  if (value.length === 0) {
    return '""';
  }
  if (/[\s&|<>^%"()]/.test(value)) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  return value;
}

/**
 * Spawn a child process, capturing stdout/stderr and timing without Node 24 DEP0190 warnings.
 */
export function runCommand(
  command: string,
  args: readonly string[] = [],
  { cwd, extraEnv, onStdout, onStderr }: RunCommandOptions = {}
): Promise<CommandResult> {
  return new Promise(resolve => {
    const startedAt = Date.now();
    const useWinCmd = needsWindowsShell(command);
    const spawnExe = useWinCmd ? 'cmd.exe' : command;
    const spawnArgs = useWinCmd ? ['/d', '/s', '/c', `"${[command, ...args].map(quoteCmdArg).join(' ')}"`] : [...args];

    const child = spawn(spawnExe, spawnArgs, {
      cwd,
      env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsVerbatimArguments: useWinCmd,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stdout += text;
      onStdout?.(text);
    });

    child.stderr?.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stderr += text;
      onStderr?.(text);
    });

    child.on('error', err => {
      resolve({
        exitCode: 1,
        stdout,
        stderr: stderr ? `${stderr}\n${err.message}` : err.message,
        seconds: (Date.now() - startedAt) / 1000,
      });
    });

    child.on('close', code => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
        seconds: (Date.now() - startedAt) / 1000,
      });
    });
  });
}

/**
 * Execute an arbitrary shell command line (for custom runner templates).
 */
export function runShellCommand(
  commandLine: string,
  { cwd, extraEnv, onStdout, onStderr }: RunCommandOptions = {}
): Promise<CommandResult> {
  return new Promise(resolve => {
    const startedAt = Date.now();
    const isWin = process.platform === 'win32';
    const exe = isWin ? 'cmd.exe' : 'sh';
    const args = isWin ? ['/d', '/s', '/c', `"${commandLine}"`] : ['-c', commandLine];

    const child = spawn(exe, args, {
      cwd,
      env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsVerbatimArguments: isWin,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stdout += text;
      onStdout?.(text);
    });

    child.stderr?.on('data', (chunk: Buffer | string) => {
      const text = chunk.toString();
      stderr += text;
      onStderr?.(text);
    });

    child.on('error', err => {
      resolve({
        exitCode: 1,
        stdout,
        stderr: stderr ? `${stderr}\n${err.message}` : err.message,
        seconds: (Date.now() - startedAt) / 1000,
      });
    });

    child.on('close', code => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
        seconds: (Date.now() - startedAt) / 1000,
      });
    });
  });
}

/**
 * Resolve an executable on PATH, returning its first resolved path or null.
 */
export async function whichExecutable(executable: string, cwd: string): Promise<string | null> {
  const checker = process.platform === 'win32' ? 'where.exe' : 'which';
  const res = await runCommand(checker, [executable], { cwd });
  if (res.exitCode !== 0) {
    return null;
  }
  const firstLine = res.stdout
    .split(/\r?\n/)
    .map(l => l.trim())
    .find(Boolean);
  return firstLine ?? null;
}

/**
 * Parse CLI flags (`--flag`, `--opt value`, `--opt=value`) and positional args against a schema.
 */
export function parseCliArgs(
  argv: readonly string[],
  {
    flags = new Set<string>(),
    options = new Set<string>(),
    maxPositionals = Number.POSITIVE_INFINITY,
  }: CliArgSchema = {}
): ParsedCliArgs {
  const parsedFlags = new Set<string>();
  const parsedOptions = new Map<string, string>();
  const positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      const optName = (eqIdx >= 0 ? arg.slice(0, eqIdx) : arg).toLowerCase();

      if (flags.has(optName)) {
        if (eqIdx >= 0) {
          throw new Error(`Flag '${optName}' does not accept a value.`);
        }
        parsedFlags.add(optName);
        continue;
      }

      if (options.has(optName)) {
        if (eqIdx >= 0) {
          parsedOptions.set(optName, arg.slice(eqIdx + 1));
        } else {
          if (i + 1 >= argv.length) {
            throw new Error(`Missing value for option '${optName}'.`);
          }
          parsedOptions.set(optName, argv[++i]);
        }
        continue;
      }

      throw new Error(`Unknown option: '${arg}'.`);
    }

    if (arg.startsWith('-') && arg !== '-') {
      throw new Error(`Unknown option: '${arg}'.`);
    }

    if (positionals.length >= maxPositionals) {
      throw new Error(`Unexpected positional argument: '${arg}'.`);
    }
    positionals.push(arg);
  }

  return { flags: parsedFlags, options: parsedOptions, positionals };
}
