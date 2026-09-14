import { createWriteStream, existsSync } from 'fs';
import { mkdir, rename } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import type { ReadableStream as WebReadableStream } from 'stream/web';
import type { TestFile } from '../fixtures/file.fixtures';

export class RemoteTestFileService {
  private readonly remoteFilesDir = path.join(process.cwd(), 'fixtures', 'testFiles', 'remote');

  async getTestFile(fileName: string, url: string): Promise<TestFile> {
    const filePath = path.join(this.remoteFilesDir, fileName);

    if (existsSync(filePath)) {
      return { name: fileName, path: filePath };
    }

    await mkdir(this.remoteFilesDir, { recursive: true });

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      throw new Error(`Failed to download test file from ${url}: ${response.status} ${response.statusText}`);
    }

    const tempFilePath = `${filePath}.tmp`;
    const readStream = Readable.fromWeb(response.body as WebReadableStream);
    const writeStream = createWriteStream(tempFilePath);
    await pipeline(readStream, writeStream);

    await rename(tempFilePath, filePath);

    return { name: fileName, path: filePath };
  }
}
