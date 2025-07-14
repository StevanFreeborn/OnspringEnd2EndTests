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

    await client.connect(this.config);
    await client.put(sourcePath, remotePath);
    await client.end();
  }

  async deleteFile(remotePath: string) {
    const client = new Client();

    await client.connect(this.config);
    await client.delete(remotePath);
    await client.end();
  }
}
