import fs from 'node:fs';
import path from 'node:path';
import { loadEnv, parseCliArgs, runCommand, writeErr, writeOut } from './utils.js';

const DEFAULT_AUTH_MAX_AGE_MINUTES = 45;

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
      flags: new Set(['--refresh-auth', '--launch', '--json']),
      options: new Set(['--route', '--session', '--script', '--max-age']),
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

  if (!Number.isFinite(maxAgeMinutes) || maxAgeMinutes < 0) {
    writeErr(`Invalid --max-age value '${maxAgeRaw ?? ''}'. Expected a non-negative number of minutes.`);
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
  const json = parsed.flags.has('--json');

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

  const commands = [
    formatCmd('open', baseUrl),
    formatCmd('state-load', authRelPath),
    formatCmd('goto', targetUrl),
    resolvedScript ? formatCmd('run-code', `--filename=${resolvedScript}`) : formatCmd('snapshot'),
    formatCmd('close'),
  ];

  const launchOutput: string[] = [];
  let scriptOutput = '';

  if (resolvedScript) {
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
  writeOut(
    `- Auth state: \`${authRelPath}\` (age: ${authAgeMinutes.toFixed(1)} min${authRefreshed ? ', freshly generated' : ''})`
  );

  if (resolvedScript) {
    writeOut(`- Executed script: \`${resolvedScript}\` (session closed cleanly)`);
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
