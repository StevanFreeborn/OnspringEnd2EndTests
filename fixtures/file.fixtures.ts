import fs from 'fs';
import path from 'path';

type FileExtension = '.jpg' | '.txt';
export type TestFile = {
  name: string;
  path: string;
};

async function getTestFileWithExtension(extension: FileExtension) {
  const testFilesDir = path.join(__dirname, 'testFiles');
  const testFiles = fs.readdirSync(testFilesDir);
  const testFile = testFiles.find(file => file.endsWith(extension));
  if (!testFile) {
    throw new Error(`No test file found with extension ${extension}`);
  }
  const testFilePath = path.join(testFilesDir, testFile);
  const testFileName = path.basename(testFilePath);

  return {
    name: testFileName,
    path: testFilePath,
  };
}

export async function jpgFile({}, use: (r: TestFile) => Promise<void>) {
  const testFile = await getTestFileWithExtension('.jpg');
  await use(testFile);
}

export async function txtFile({}, use: (r: TestFile) => Promise<void>) {
  const testFile = await getTestFileWithExtension('.txt');
  await use(testFile);
}
