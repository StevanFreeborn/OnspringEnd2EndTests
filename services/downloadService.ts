import { Download } from '@playwright/test';
import path from 'path';

export class DownloadService {
  async saveDownload(download: Download) {
    const downloadPath = path.join(process.cwd(), 'downloads', download.suggestedFilename());
    await download.saveAs(downloadPath);
    return downloadPath;
  }
}
