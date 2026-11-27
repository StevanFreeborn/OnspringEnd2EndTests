import fs from 'node:fs';
import path from 'node:path';
import { runCommand } from './utils.js';

export type WorktreeHandle = {
  path: string;
  branch: string;
  created: boolean;
};

export type CreateWorktreeOptions = {
  slug: string;
  baseRef: string;
  installDeps: boolean;
};

export function slugify(input: string, maxLength = 48): string {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');

  return normalized || 'task';
}

async function branchExists(repoRoot: string, branchName: string): Promise<boolean> {
  const res = await runCommand('git', ['rev-parse', '--verify', '--quiet', `refs/heads/${branchName}`], {
    cwd: repoRoot,
  });
  return res.exitCode === 0;
}

function createDirLink(targetPath: string, linkPath: string): void {
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  let resolved = targetPath;
  try {
    resolved = fs.realpathSync(targetPath);
  } catch {
    resolved = targetPath;
  }
  fs.symlinkSync(resolved, linkPath, linkType);
}

function discoverWorkspacePackages(worktreePath: string): Map<string, string> {
  const packages = new Map<string, string>();
  const rootPkgPath = path.join(worktreePath, 'package.json');
  if (!fs.existsSync(rootPkgPath)) {
    return packages;
  }

  let patterns: string[] = [];
  try {
    const raw = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')) as { workspaces?: unknown };
    if (Array.isArray(raw.workspaces)) {
      patterns = raw.workspaces.filter((item): item is string => typeof item === 'string');
    } else if (
      raw.workspaces &&
      typeof raw.workspaces === 'object' &&
      Array.isArray((raw.workspaces as { packages?: unknown }).packages)
    ) {
      patterns = (raw.workspaces as { packages: unknown[] }).packages.filter(
        (item): item is string => typeof item === 'string'
      );
    }
  } catch {
    return packages;
  }

  const registerDir = (dirPath: string): void => {
    const pkgJsonPath = path.join(dirPath, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) {
      return;
    }
    try {
      const parsed = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')) as { name?: unknown };
      if (typeof parsed.name === 'string' && parsed.name.trim()) {
        packages.set(parsed.name.trim(), dirPath);
      }
    } catch {
      // Ignore malformed workspace package.json files.
    }
  };

  for (const rawPattern of patterns) {
    const pattern = rawPattern.trim().replace(/\/+$/, '');
    if (!pattern) {
      continue;
    }

    if (pattern.endsWith('/*')) {
      const baseDir = path.join(worktreePath, pattern.slice(0, -2));
      if (!fs.existsSync(baseDir)) {
        continue;
      }
      for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          registerDir(path.join(baseDir, entry.name));
        }
      }
      continue;
    }

    const dirPath = path.join(worktreePath, pattern);
    if (fs.existsSync(dirPath)) {
      registerDir(dirPath);
    }
  }

  return packages;
}

export function linkWorktreeNodeModules(repoRoot: string, worktreePath: string): void {
  const rootNodeModules = path.join(repoRoot, 'node_modules');
  const worktreeNodeModules = path.join(worktreePath, 'node_modules');
  if (!fs.existsSync(rootNodeModules) || fs.existsSync(worktreeNodeModules)) {
    return;
  }

  const workspacePackages = discoverWorkspacePackages(worktreePath);
  const scopedWorkspaces = new Map<string, Map<string, string>>();
  const unscopedWorkspaces = new Map<string, string>();

  for (const [pkgName, pkgDir] of workspacePackages) {
    if (pkgName.startsWith('@') && pkgName.includes('/')) {
      const slashIdx = pkgName.indexOf('/');
      const scope = pkgName.slice(0, slashIdx);
      const name = pkgName.slice(slashIdx + 1);
      const scopeMap = scopedWorkspaces.get(scope) ?? new Map<string, string>();
      scopeMap.set(name, pkgDir);
      scopedWorkspaces.set(scope, scopeMap);
    } else {
      unscopedWorkspaces.set(pkgName, pkgDir);
    }
  }

  fs.mkdirSync(worktreeNodeModules, { recursive: true });
  const handledScopes = new Set<string>();
  const handledUnscoped = new Set<string>();

  for (const entry of fs.readdirSync(rootNodeModules)) {
    if (entry === '.package-lock.json') {
      continue;
    }

    const src = path.join(rootNodeModules, entry);
    const dest = path.join(worktreeNodeModules, entry);
    const unscopedTarget = unscopedWorkspaces.get(entry);
    if (unscopedTarget) {
      createDirLink(unscopedTarget, dest);
      handledUnscoped.add(entry);
      continue;
    }

    const scopePackages = scopedWorkspaces.get(entry);
    if (scopePackages) {
      handledScopes.add(entry);
      fs.mkdirSync(dest, { recursive: true });
      const linkedInScope = new Set<string>();

      let srcIsDir = false;
      try {
        srcIsDir = fs.lstatSync(src).isDirectory();
      } catch {
        srcIsDir = false;
      }

      if (srcIsDir) {
        for (const sub of fs.readdirSync(src)) {
          const destSub = path.join(dest, sub);
          const pkgTarget = scopePackages.get(sub);
          if (pkgTarget) {
            createDirLink(pkgTarget, destSub);
            linkedInScope.add(sub);
            continue;
          }

          const srcSub = path.join(src, sub);
          const subStat = fs.lstatSync(srcSub);
          if (subStat.isDirectory() || subStat.isSymbolicLink()) {
            createDirLink(srcSub, destSub);
          } else if (subStat.isFile()) {
            fs.copyFileSync(srcSub, destSub);
          }
        }
      }

      for (const [pkgName, pkgDir] of scopePackages) {
        if (!linkedInScope.has(pkgName)) {
          createDirLink(pkgDir, path.join(dest, pkgName));
        }
      }
      continue;
    }

    const stat = fs.lstatSync(src);
    if (stat.isDirectory() || stat.isSymbolicLink()) {
      createDirLink(src, dest);
    } else if (stat.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  for (const [pkgName, pkgDir] of unscopedWorkspaces) {
    if (!handledUnscoped.has(pkgName)) {
      createDirLink(pkgDir, path.join(worktreeNodeModules, pkgName));
    }
  }

  for (const [scope, scopePackages] of scopedWorkspaces) {
    if (!handledScopes.has(scope)) {
      const scopeDest = path.join(worktreeNodeModules, scope);
      fs.mkdirSync(scopeDest, { recursive: true });
      for (const [pkgName, pkgDir] of scopePackages) {
        createDirLink(pkgDir, path.join(scopeDest, pkgName));
      }
    }
  }
}

export function unlinkWorktreeNodeModules(worktreeNodeModules: string): void {
  let stat: fs.Stats;
  try {
    stat = fs.lstatSync(worktreeNodeModules);
  } catch {
    return;
  }

  if (stat.isSymbolicLink()) {
    fs.unlinkSync(worktreeNodeModules);
    return;
  }

  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(worktreeNodeModules)) {
      unlinkWorktreeNodeModules(path.join(worktreeNodeModules, entry));
    }
    fs.rmdirSync(worktreeNodeModules);
    return;
  }

  fs.unlinkSync(worktreeNodeModules);
}

export async function createAgentWorktree(
  repoRoot: string,
  { slug, baseRef, installDeps }: CreateWorktreeOptions
): Promise<WorktreeHandle> {
  const worktreesRoot = path.join(repoRoot, '.agent-worktrees');
  fs.mkdirSync(worktreesRoot, { recursive: true });

  let uniqueSlug = slugify(slug);
  let worktreePath = path.join(worktreesRoot, uniqueSlug);
  let branch = `agent/${uniqueSlug}`;

  if (fs.existsSync(worktreePath) || (await branchExists(repoRoot, branch))) {
    const suffix = Date.now().toString(36);
    uniqueSlug = `${slugify(slug, 36)}-${suffix}`;
    worktreePath = path.join(worktreesRoot, uniqueSlug);
    branch = `agent/${uniqueSlug}`;
  }

  const addRes = await runCommand('git', ['worktree', 'add', '-b', branch, worktreePath, baseRef], {
    cwd: repoRoot,
  });
  if (addRes.exitCode !== 0) {
    throw new Error(`Failed to create git worktree at '${worktreePath}':\n${addRes.stderr || addRes.stdout}`);
  }

  try {
    const rootEnv = path.join(repoRoot, '.env');
    if (fs.existsSync(rootEnv)) {
      fs.copyFileSync(rootEnv, path.join(worktreePath, '.env'));
    }

    const rootAuth = path.join(repoRoot, '.auth', 'sysAdmin.json');
    if (fs.existsSync(rootAuth)) {
      const worktreeAuthDir = path.join(worktreePath, '.auth');
      fs.mkdirSync(worktreeAuthDir, { recursive: true });
      fs.copyFileSync(rootAuth, path.join(worktreeAuthDir, 'sysAdmin.json'));
    }

    const rootNodeModules = path.join(repoRoot, 'node_modules');
    const worktreeNodeModules = path.join(worktreePath, 'node_modules');
    if (installDeps) {
      const ciRes = await runCommand('npm', ['ci'], { cwd: worktreePath });
      if (ciRes.exitCode !== 0) {
        throw new Error(`npm ci failed in worktree '${worktreePath}':\n${ciRes.stderr || ciRes.stdout}`);
      }
    } else if (fs.existsSync(rootNodeModules) && !fs.existsSync(worktreeNodeModules)) {
      linkWorktreeNodeModules(repoRoot, worktreePath);
    }

    const buildRes = await runCommand('npm', ['run', 'build:packages'], { cwd: worktreePath });
    if (buildRes.exitCode !== 0) {
      throw new Error(
        `npm run build:packages failed in worktree '${worktreePath}':\n${buildRes.stderr || buildRes.stdout}`
      );
    }

    return { path: worktreePath, branch, created: true };
  } catch (err) {
    await removeAgentWorktree(repoRoot, { path: worktreePath, branch, created: true }, true);
    throw err;
  }
}

export async function removeAgentWorktree(
  repoRoot: string,
  handle: WorktreeHandle,
  deleteBranch = false
): Promise<void> {
  if (!handle.created) {
    return;
  }

  const worktreeNodeModules = path.join(handle.path, 'node_modules');
  unlinkWorktreeNodeModules(worktreeNodeModules);

  await runCommand('git', ['worktree', 'remove', '--force', handle.path], { cwd: repoRoot });
  await runCommand('git', ['worktree', 'prune'], { cwd: repoRoot });

  if (deleteBranch) {
    await runCommand('git', ['branch', '-D', handle.branch], { cwd: repoRoot });
  }
}
