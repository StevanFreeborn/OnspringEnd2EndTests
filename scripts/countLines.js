import fs from 'fs/promises';
import path from 'path';
import ignore from 'ignore';

try{
  await countLines();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

async function countLines() {
  const repoRoot = process.cwd();
  let totalLines = 0;
  let totalFiles = 0;

  const gitignorePatterns = await getGitignorePatterns(repoRoot);
  const ig = ignore().add(gitignorePatterns);

  async function walkDir(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(repoRoot, fullPath);

      if (ig.ignores(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        totalFiles++;
        const lines = await countLinesInFile(fullPath);
        totalLines += lines;
      }
    }
  }

  console.log('Counting lines in TypeScript files...');
  
  await walkDir(repoRoot);

  console.log(`--- Summary ---`);
  console.log(`Total TypeScript files found: ${totalFiles}`);
  console.log(`Total lines of TypeScript code: ${totalLines}`);
}

async function countLinesInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    console.warn(`Could not read file: ${filePath} - ${error.message}`);
    return 0;
  }
}


async function getGitignorePatterns(repoRoot) {
  const gitignorePath = path.join(repoRoot, '.gitignore');
  try {
    const content = await fs.readFile(gitignorePath, 'utf8');
    return content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
  } catch (error) {
    return [];
  }
}
