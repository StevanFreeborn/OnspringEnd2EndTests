import { Download } from '@playwright/test';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export class DownloadService {
  private readonly downloadsDir: string;

  constructor(downloadsDir = path.join(process.cwd(), 'downloads')) {
    this.downloadsDir = downloadsDir;
  }

  async saveDownload(download: Download): Promise<string> {
    if (existsSync(this.downloadsDir) === false) {
      await mkdir(this.downloadsDir, { recursive: true });
    }

    const downloadName = `${randomUUID()}-${download.suggestedFilename()}`;
    const downloadPath = path.join(this.downloadsDir, downloadName);
    await download.saveAs(downloadPath);
    return downloadPath;
  }

  async saveBuffer(buffer: Uint8Array, fileName: string): Promise<string> {
    const downloadName = `${randomUUID()}-${fileName}`;

    if (existsSync(this.downloadsDir) === false) {
      await mkdir(this.downloadsDir, { recursive: true });
    }

    const downloadPath = path.join(this.downloadsDir, downloadName);
    await writeFile(downloadPath, buffer);
    return downloadPath;
  }
}
