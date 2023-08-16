export class User {
  readonly username: string;
  readonly password: string;
  readonly fullName: string;

  constructor(username: string, password: string, fullName: string) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
  }
}
