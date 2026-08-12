import Client from 'ssh2-sftp-client';

type Config = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export class SftpService {
  private readonly config: Config;

  constructor(config: Config) {
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
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
    } finally {
      await client.end();
    }
  }

  async deleteFile(remotePath: string) {
    const client = new Client();

    try {
      await client.connect(this.config);
      await client.delete(remotePath);
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(e.message);
      }
    } finally {
      await client.end();
    }
  }
}
