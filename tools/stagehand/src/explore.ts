import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { loadEnv, parseCliArgs, runCommand, writeErr, writeOut } from './utils.js';

const DEFAULT_AUTH_MAX_AGE_MINUTES = 45;

type ExploreEngine = 'node' | 'cli';

type ExplorePage = {
  goto: (
    url: string,
    options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }
  ) => Promise<unknown>;
};

type ExploreContext = {
  newPage: () => Promise<ExplorePage>;
  close: () => Promise<void>;
};

type ExploreBrowser = {
  newContext: (options?: {
    storageState?: string;
    viewport?: { width: number; height: number };
  }) => Promise<ExploreContext>;
  close: () => Promise<void>;
};

type ExplorePlaywrightModule = {
  chromium: {
    launch: (options?: { headless?: boolean }) => Promise<ExploreBrowser>;
  };
};

export function parseExploreScriptFunction(
  scriptSource: string,
  filename = 'explore-script.js'
): (page: unknown) => Promise<unknown> {
  const cleaned = scriptSource.replace(/^\uFEFF/, '').trim();
  if (!cleaned) {
    throw new Error(`Explore script '${filename}' is empty.`);
  }

  if (/\bmodule\.exports\b/.test(cleaned) || /\bexports\.default\b/.test(cleaned)) {
    const mod: { exports: unknown } = { exports: {} };
    const wrapper = vm.runInThisContext(`(function(module, exports) {\n${cleaned}\n})`, { filename }) as (
      m: { exports: unknown },
      e: unknown
    ) => void;
    wrapper(mod, mod.exports);
    let candidate = mod.exports;
    if (candidate && typeof candidate === 'object' && 'default' in candidate) {
      candidate = (candidate as { default: unknown }).default;
    }
    if (typeof candidate !== 'function') {
      throw new Error(`Explore script '${filename}' must export a function.`);
    }
    return candidate as (page: unknown) => Promise<unknown>;
  }

  const expr = cleaned.replace(/^export\s+default\s+/, '').replace(/;+\s*$/, '');
  const evaluated = vm.runInThisContext(`(${expr})`, { filename }) as unknown;
  if (typeof evaluated !== 'function') {
    throw new Error(`Explore script '${filename}' must evaluate to a function (for example: async page => { ... }).`);
  }
  return evaluated as (page: unknown) => Promise<unknown>;
}

async function executeExploreScriptDirect(
  repoRoot: string,
  {
    targetUrl,
    authFullPath,
    resolvedScript,
    headed,
  }: {
    targetUrl: string;
    authFullPath: string;
    resolvedScript: string;
    headed: boolean;
  }
): Promise<string> {
  const requireFromRepo = createRequire(path.join(repoRoot, 'package.json'));
  const pw = requireFromRepo('@playwright/test') as ExplorePlaywrightModule;
  const scriptSource = fs.readFileSync(resolvedScript, 'utf8');
  const scriptFn = parseExploreScriptFunction(scriptSource, resolvedScript);

  const browser = await pw.chromium.launch({ headless: !headed });
  try {
    const context = await browser.newContext({
      storageState: authFullPath,
      viewport: { width: 1440, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      const result = await scriptFn(page);
      if (result === undefined) {
        return '';
      }
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

async function detectPlaywrightCli(repoRoot: string): Promise<{ exe: string; prefixArgs: readonly string[] }> {
  const checker = process.platform === 'win32' ? 'where.exe' : 'which';
  const res = await runCommand(checker, ['playwright-cli'], { cwd: repoRoot });
  if (res.exitCode === 0 && res.stdout.trim()) {
    return { exe: 'playwright-cli', prefixArgs: [] };
  }
  return { exe: 'npx', prefixArgs: ['--yes', '@playwright/cli'] };
}

function resolveScriptPath(repoRoot: string, rawScriptPath: string): string | null {
  const fromCwd = path.resolve(process.cwd(), rawScriptPath);
  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }

  const fromRepo = path.resolve(repoRoot, rawScriptPath);
  if (fs.existsSync(fromRepo)) {
    return fromRepo;
  }

  return null;
}

export async function runExplore(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--refresh-auth', '--launch', '--headed', '--json']),
      options: new Set(['--route', '--session', '--script', '--max-age', '--engine']),
      maxPositionals: 0,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const routeRaw = (parsed.options.get('--route') ?? '/').trim();
  const route = !routeRaw ? '/' : routeRaw.startsWith('/') ? routeRaw : `/${routeRaw}`;
  const session = parsed.options.get('--session')?.trim() || null;
  const rawScript = parsed.options.get('--script')?.trim() || null;
  const maxAgeRaw = parsed.options.get('--max-age');
  const maxAgeMinutes = maxAgeRaw === undefined ? DEFAULT_AUTH_MAX_AGE_MINUTES : Number.parseFloat(maxAgeRaw);
  const rawEngine = parsed.options.get('--engine')?.trim().toLowerCase();

  if (!Number.isFinite(maxAgeMinutes) || maxAgeMinutes < 0) {
    writeErr(`Invalid --max-age value '${maxAgeRaw ?? ''}'. Expected a non-negative number of minutes.`);
    return 2;
  }

  if (rawEngine !== undefined && rawEngine !== 'node' && rawEngine !== 'cli') {
    writeErr(`Invalid --engine value '${rawEngine}'. Expected: node or cli.`);
    return 2;
  }

  let resolvedScript: string | null = null;
  if (rawScript) {
    resolvedScript = resolveScriptPath(repoRoot, rawScript);
    if (!resolvedScript) {
      writeErr(`Error: Script file not found: '${rawScript}'.`);
      return 1;
    }
  }

  const refreshAuth = parsed.flags.has('--refresh-auth');
  const launch = parsed.flags.has('--launch');
  const headed = parsed.flags.has('--headed');
  const json = parsed.flags.has('--json');
  const engine: ExploreEngine = rawEngine ? (rawEngine as ExploreEngine) : resolvedScript ? 'node' : 'cli';

  const env = loadEnv(repoRoot);
  const testEnv = env.TEST_ENV?.trim();
  if (!testEnv) {
    writeErr('Error: TEST_ENV is not set in environment or .env.');
    return 1;
  }

  const urlKey = `${testEnv.toUpperCase()}_INSTANCE_URL`;
  const rawBaseUrl = env[urlKey]?.trim();
  if (!rawBaseUrl) {
    writeErr(`Error: ${urlKey} is not set in environment or .env.`);
    return 1;
  }

  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const targetUrl = `${baseUrl}${route}`;
  const authRelPath = '.auth/sysAdmin.json';
  const authFullPath = path.join(repoRoot, '.auth', 'sysAdmin.json');
  const authExists = fs.existsSync(authFullPath);
  const existingAgeMinutes = authExists ? (Date.now() - fs.statSync(authFullPath).mtimeMs) / 60000 : Infinity;
  const isStale = existingAgeMinutes > maxAgeMinutes;
  let authRefreshed = false;

  if (refreshAuth || !authExists || isStale) {
    if (!json) {
      const reason = refreshAuth
        ? '--refresh-auth requested'
        : !authExists
          ? 'missing auth state'
          : `auth state older than ${maxAgeMinutes} min`;
      writeOut(`Running auth setup (${reason}; KEEP_AUTH_STATE=true) to persist \`${authRelPath}\`...`);
    }

    const setupRes = await runCommand('npx', ['playwright', 'test', '--project', 'setup'], {
      cwd: repoRoot,
      extraEnv: { KEEP_AUTH_STATE: 'true' },
    });

    if (setupRes.exitCode !== 0 || !fs.existsSync(authFullPath)) {
      writeErr('Error: Auth setup failed; .auth/sysAdmin.json was not created.');
      if (setupRes.stdout.trim()) writeErr(setupRes.stdout.trim());
      if (setupRes.stderr.trim()) writeErr(setupRes.stderr.trim());
      return 1;
    }

    authRefreshed = true;
  }

  const stats = fs.statSync(authFullPath);
  const authAgeMinutes = Number(((Date.now() - stats.mtimeMs) / 60000).toFixed(1));
  const { exe, prefixArgs } = await detectPlaywrightCli(repoRoot);
  const sessionFlag = session ? `-s=${session}` : null;

  const buildArgs = (...cmdArgs: string[]): string[] => [
    ...prefixArgs,
    ...(sessionFlag ? [sessionFlag] : []),
    ...cmdArgs,
  ];
  const formatCmd = (...cmdArgs: string[]): string => [exe, ...buildArgs(...cmdArgs)].join(' ');

  const commands =
    resolvedScript && engine === 'node'
      ? [
          `node tools/stagehand/dist/src/cli.js explore --route ${route} --script ${resolvedScript}${headed ? ' --headed' : ''}`,
        ]
      : [
          formatCmd('open', baseUrl),
          formatCmd('state-load', authRelPath),
          formatCmd('goto', targetUrl),
          resolvedScript ? formatCmd('run-code', `--filename=${resolvedScript}`) : formatCmd('snapshot'),
          formatCmd('close'),
        ];

  const launchOutput: string[] = [];
  let scriptOutput = '';

  if (resolvedScript && engine === 'node') {
    try {
      scriptOutput = await executeExploreScriptDirect(repoRoot, {
        targetUrl,
        authFullPath,
        resolvedScript,
        headed,
      });
    } catch (err) {
      writeErr(`Error running script \`${resolvedScript}\`:`);
      writeErr(err instanceof Error ? (err.stack ?? err.message) : String(err));
      return 1;
    }
  } else if (resolvedScript) {
    const preSteps: string[][] = [
      ['open', baseUrl],
      ['state-load', authRelPath],
      ['goto', targetUrl],
    ];
    try {
      for (const step of preSteps) {
        const fullArgs = buildArgs(...step);
        const res = await runCommand(exe, fullArgs, { cwd: repoRoot });
        if (res.exitCode !== 0) {
          writeErr(`Error running \`${exe} ${fullArgs.join(' ')}\`:`);
          if (res.stdout.trim()) writeErr(res.stdout.trim());
          if (res.stderr.trim()) writeErr(res.stderr.trim());
          return 1;
        }
      }

      const scriptArgs = buildArgs('run-code', `--filename=${resolvedScript}`);
      const scriptRes = await runCommand(exe, scriptArgs, { cwd: repoRoot });
      scriptOutput = scriptRes.stdout.trim();
      if (scriptRes.exitCode !== 0) {
        writeErr(`Error running script \`${resolvedScript}\`:`);
        if (scriptOutput) writeErr(scriptOutput);
        if (scriptRes.stderr.trim()) writeErr(scriptRes.stderr.trim());
        return 1;
      }
    } finally {
      await runCommand(exe, buildArgs('close'), { cwd: repoRoot });
    }
  } else if (launch) {
    const steps: string[][] = [['open', baseUrl], ['state-load', authRelPath], ['goto', targetUrl], ['snapshot']];
    for (const step of steps) {
      const fullArgs = buildArgs(...step);
      const res = await runCommand(exe, fullArgs, { cwd: repoRoot });
      launchOutput.push(`$ ${exe} ${fullArgs.join(' ')}\n${res.stdout}`.trimEnd());
      if (res.exitCode !== 0) {
        writeErr(`Error running \`${exe} ${fullArgs.join(' ')}\`:`);
        if (res.stdout.trim()) writeErr(res.stdout.trim());
        if (res.stderr.trim()) writeErr(res.stderr.trim());
        return 1;
      }
    }
  }

  if (json) {
    writeOut(
      JSON.stringify(
        {
          testEnv,
          baseUrl,
          targetUrl,
          engine,
          authStatePath: authRelPath,
          authRefreshed,
          authAgeMinutes,
          cliCommand: [exe, ...prefixArgs].join(' '),
          commands,
          launched: launch,
          scriptExecuted: Boolean(resolvedScript),
          ...(resolvedScript ? { scriptPath: resolvedScript, scriptOutput } : {}),
          ...(launch && !resolvedScript ? { launchOutput } : {}),
        },
        null,
        2
      )
    );
    return 0;
  }

  writeOut('# Onspring UI Exploration Session');
  writeOut(`- Environment: \`${testEnv}\` (\`${baseUrl}\`)`);
  writeOut(`- Target URL: \`${targetUrl}\``);
  writeOut(`- Engine: \`${engine}\``);
  writeOut(
    `- Auth state: \`${authRelPath}\` (age: ${authAgeMinutes.toFixed(1)} min${authRefreshed ? ', freshly generated' : ''})`
  );

  if (resolvedScript) {
    const closeNote = engine === 'node' ? 'direct Playwright Node session closed' : 'session closed cleanly';
    writeOut(`- Executed script: \`${resolvedScript}\` (${closeNote})`);
    writeOut();
    writeOut('## Script Output');
    writeOut(scriptOutput || '(no output)');
    return 0;
  }

  writeOut();
  writeOut('## Playwright CLI Commands');
  writeOut('```sh');
  for (const cmd of commands) {
    writeOut(cmd);
  }
  writeOut('```');

  if (launch && launchOutput.length > 0) {
    writeOut();
    writeOut('## Launch Output');
    for (const out of launchOutput) {
      writeOut(out);
    }
  }

  return 0;
}
