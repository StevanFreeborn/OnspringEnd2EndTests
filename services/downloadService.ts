import { Download } from '@playwright/test';
import { writeFile } from 'fs/promises';
import path from 'path';
import { FakeDataFactory } from '../factories/fakeDataFactory';

export class DownloadService {
  async saveDownload(download: Download) {
    const downloadName = `${FakeDataFactory.createUniqueIdentifier()}-${download.suggestedFilename()}`;
    const downloadPath = path.join(process.cwd(), 'downloads', downloadName);
    await download.saveAs(downloadPath);
    return downloadPath;
  }

  async saveBuffer(buffer: Buffer, fileName: string) {
    const downloadName = `${FakeDataFactory.createUniqueIdentifier()}-${fileName}`;
    const downloadPath = path.join(process.cwd(), 'downloads', downloadName);
    await writeFile(downloadPath, buffer);
    return downloadPath;
  }
}
