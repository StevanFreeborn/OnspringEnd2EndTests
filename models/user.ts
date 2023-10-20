export class User {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly fullName: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.fullName = `${firstName} ${lastName}`;
  }
}
