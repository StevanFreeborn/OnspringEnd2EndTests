import Client from 'ssh2-sftp-client';

export type SftpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export class SftpService {
  private readonly config: SftpConfig;

  constructor(config: SftpConfig) {
    this.config = config;
  }

  hostname() {
    return this.config.host;
  }

  port() {
    return this.config.port;
  }

  username() {
    return this.config.username;
  }

  password() {
    return this.config.password;
  }

  async uploadFile(sourcePath: string, remotePath: string) {
    const client = new Client();

    try {
      await client.connect(this.config);
      await client.put(sourcePath, remotePath);
    } finally {
      await client.end();
    }
  }

  async deleteFile(remotePath: string, options: { ignoreMissing?: boolean } = {}) {
    const { ignoreMissing = true } = options;
    const client = new Client();

    try {
      await client.connect(this.config);
      await client.delete(remotePath);
    } catch (e) {
      if (!ignoreMissing) {
        throw e;
      }
    } finally {
      await client.end();
    }
  }
}
