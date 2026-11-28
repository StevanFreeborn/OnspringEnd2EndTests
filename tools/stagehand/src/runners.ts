import { parseCliArgs, whichExecutable, writeErr, writeOut } from './utils.js';
import { createStyler, renderHeaderBox, renderTable, statusBadge, supportsColor, truncateText } from './ui.js';

export type RunnerName = 'agy' | 'opencode' | 'copilot' | 'claude' | 'codex' | 'custom';

export type RunnerInvocation = {
  command: string;
  args: string[];
  shellCommand?: string;
  env?: Record<string, string>;
};

export type RunnerBuildOptions = {
  promptFile: string;
  runDir: string;
  worktreeDir: string;
  model?: string;
  customCmd?: string;
};

export type RunnerAdapter = {
  name: RunnerName;
  executable: string;
  description: string;
  buildInvocation: (opts: RunnerBuildOptions) => RunnerInvocation;
};

export type RunnerStatus = {
  name: RunnerName;
  executable: string;
  description: string;
  available: boolean;
  resolvedPath: string | null;
};

const VALID_RUNNERS: readonly RunnerName[] = ['agy', 'opencode', 'copilot', 'claude', 'codex', 'custom'];
const AUTO_DETECT_ORDER: readonly RunnerName[] = ['agy', 'opencode', 'copilot', 'claude', 'codex'];

function bootstrapMessage(promptFile: string): string {
  return `Read and execute all instructions in "${promptFile}". Follow AGENTS.md, CONTRIBUTING.md, and .agents/skills/author-onspring-test/SKILL.md. Do not commit changes.`;
}

const ADAPTERS: Record<RunnerName, RunnerAdapter> = {
  agy: {
    name: 'agy',
    executable: 'agy',
    description: 'Antigravity CLI (headless --print --mode auto)',
    buildInvocation: ({ promptFile, runDir, model }) => ({
      command: 'agy',
      args: [
        '--print',
        '--mode',
        'auto',
        '--dangerously-skip-permissions',
        '--output-format',
        'text',
        '--add-dir',
        runDir,
        ...(model ? ['--model', model] : []),
        bootstrapMessage(promptFile),
      ],
    }),
  },
  opencode: {
    name: 'opencode',
    executable: 'opencode',
    description: 'OpenCode CLI (headless opencode run --auto --archived)',
    buildInvocation: ({ promptFile, model }) => ({
      command: 'opencode',
      args: [
        'run',
        '--auto',
        '--archived',
        '--format',
        'default',
        ...(model ? ['--model', model] : []),
        '--file',
        promptFile,
        'Follow all instructions in the attached prompt above. The full prompt is already attached inline—do not attempt to read the prompt file from disk, and do not commit changes.',
      ],
    }),
  },
  copilot: {
    name: 'copilot',
    executable: 'copilot',
    description: 'GitHub Copilot CLI (headless -p --allow-all-tools)',
    buildInvocation: ({ promptFile, runDir, model }) => ({
      command: 'copilot',
      args: [
        '--trust-folder',
        '--allow-all-tools',
        '--no-ask-user',
        '--no-color',
        '--stream',
        'on',
        '--add-dir',
        runDir,
        ...(model ? ['--model', model] : []),
        '-p',
        bootstrapMessage(promptFile),
      ],
    }),
  },
  claude: {
    name: 'claude',
    executable: 'claude',
    description: 'Claude Code CLI (headless -p --permission-mode acceptEdits)',
    buildInvocation: ({ promptFile, model }) => ({
      command: 'claude',
      args: [
        '-p',
        bootstrapMessage(promptFile),
        '--permission-mode',
        'acceptEdits',
        ...(model ? ['--model', model] : []),
      ],
    }),
  },
  codex: {
    name: 'codex',
    executable: 'codex',
    description: 'OpenAI Codex CLI (headless exec --full-auto)',
    buildInvocation: ({ promptFile, model }) => ({
      command: 'codex',
      args: ['exec', '--full-auto', ...(model ? ['--model', model] : []), bootstrapMessage(promptFile)],
    }),
  },
  custom: {
    name: 'custom',
    executable: '',
    description: 'Custom command template via --runner-cmd ({{promptFile}}, {{runDir}}, {{worktree}})',
    buildInvocation: ({ promptFile, runDir, worktreeDir, customCmd }) => {
      if (!customCmd?.trim()) {
        throw new Error('Runner "custom" requires --runner-cmd "<command template>".');
      }

      const quotePath = (value: string): string => (/\s/.test(value) ? `"${value}"` : value);
      const expanded = customCmd
        .replace(/\{\{promptFile\}\}/g, quotePath(promptFile))
        .replace(/\{\{runDir\}\}/g, quotePath(runDir))
        .replace(/\{\{worktree\}\}/g, quotePath(worktreeDir));

      return {
        command: expanded,
        args: [],
        shellCommand: expanded,
      };
    },
  },
};

export function isValidRunnerName(value: string): value is RunnerName {
  return (VALID_RUNNERS as readonly string[]).includes(value);
}

export function getRunnerAdapter(name: RunnerName): RunnerAdapter {
  return ADAPTERS[name];
}

export async function detectAvailableRunners(repoRoot: string): Promise<RunnerStatus[]> {
  const results: RunnerStatus[] = [];

  for (const name of VALID_RUNNERS) {
    const adapter = ADAPTERS[name];
    if (name === 'custom') {
      results.push({
        name,
        executable: '(template)',
        description: adapter.description,
        available: true,
        resolvedPath: null,
      });
      continue;
    }

    const resolvedPath = await whichExecutable(adapter.executable, repoRoot);
    results.push({
      name,
      executable: adapter.executable,
      description: adapter.description,
      available: resolvedPath !== null,
      resolvedPath,
    });
  }

  return results;
}

export async function resolveDefaultRunner(repoRoot: string): Promise<RunnerName | null> {
  const statuses = await detectAvailableRunners(repoRoot);
  for (const preferred of AUTO_DETECT_ORDER) {
    const match = statuses.find(s => s.name === preferred && s.available);
    if (match) {
      return preferred;
    }
  }
  return null;
}

export async function runRunnersCommand(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--json']),
      options: new Set(),
      maxPositionals: 0,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const statuses = await detectAvailableRunners(repoRoot);
  if (parsed.flags.has('--json')) {
    writeOut(JSON.stringify({ runners: statuses }, null, 2));
    return 0;
  }

  const outColor = supportsColor(process.stdout);
  const s = createStyler(outColor);
  const installedCount = statuses.filter(st => st.available && st.name !== 'custom').length;
  const totalBuiltIn = statuses.filter(st => st.name !== 'custom').length;

  writeOut(
    renderHeaderBox(
      'Available Stagehand Runners',
      [{ label: 'Detected', value: `${installedCount}/${totalBuiltIn} CLI runner(s) on PATH` }],
      { color: outColor }
    )
  );
  writeOut();
  writeOut(
    renderTable(
      ['Runner', 'Status', 'Description', 'Path'],
      statuses.map(st => [
        st.available ? s.bold(st.name) : s.dim(st.name),
        statusBadge(st.available ? 'yes' : 'no', outColor),
        truncateText(st.description, 44),
        st.resolvedPath ? s.dim(truncateText(st.resolvedPath, 38)) : s.dim('-'),
      ]),
      { color: outColor }
    )
  );

  return 0;
}
