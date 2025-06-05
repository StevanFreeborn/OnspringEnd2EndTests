import fs from 'fs';
import path from 'path';
import { FakeDataFactory } from '../factories/fakeDataFactory';

type FileExtension = '.jpg' | '.txt';

export type TestFile = {
  name: string;
  path: string;
};

async function getTestFileWithExtension(extension: FileExtension) {
  const testFilesDir = path.join(process.cwd(), 'fixtures', 'testFiles');
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

async function getTestFileWithName(name: string) {
  const testFilesDir = path.join(process.cwd(), 'fixtures', 'testFiles');
  const testFiles = fs.readdirSync(testFilesDir);
  const testFile = testFiles.find(file => file === name);
  
  if (!testFile) {
    throw new Error(`No test file found with name ${name}`);
  }

  const testFilePath = path.join(testFilesDir, testFile);
  
  return {
    name: testFile,
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

export async function large45mbTxtFile({}, use: (r: TestFile) => Promise<void>) {
  const testFile = await getTestFileWithName('45mb.txt');
  await use(testFile);
}

export async function large51mbTxtFile({}, use: (r: TestFile) => Promise<void>) {
  const testFile = await getTestFileWithName('51mb.txt');
  await use(testFile);
}

/**
 * Write a CSV file with the given data and returns the file path.
 * The keys of the first object in the data array will be used as the header row.
 * @param data - The data to write to the CSV file
 * @returns The file path of the written CSV file
 */
export function writeCsvFile<T extends object>(data: T[]) {
  const uniqueId = FakeDataFactory.createUniqueIdentifier();
  const fileName = `${uniqueId}_testData.csv`;
  const csvDir = path.join(process.cwd(), 'data-import-files');

  if (fs.existsSync(csvDir) === false) {
    fs.mkdirSync(csvDir);
  }

  const csvFilePath = path.join(csvDir, fileName);
  const headerValues = Object.keys(data[0]);
  const rowValues = data.map(row => Object.values(row).join(','));
  const csv = [headerValues.join(','), ...rowValues].join('\n');
  fs.writeFileSync(csvFilePath, csv);
  return csvFilePath;
}
