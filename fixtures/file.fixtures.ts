import fs from 'fs';
import path from 'path';

type FileExtension = '.jpg';

async function getTestFileWithExtension(extension: FileExtension) {
  const testFilesDir = path.join(__dirname, 'testFiles');
  const testFiles = fs.readdirSync(testFilesDir);
  const testFile = testFiles.find(file => file.endsWith(extension));
  if (!testFile) {
    throw new Error(`No test file found with extension ${extension}`);
  }
  return path.join(testFilesDir, testFile);
}

export async function jpgFilePath({}, use: (r: string) => Promise<void>) {
  const filePath = await getTestFileWithExtension('.jpg');
  await use(filePath);
}
