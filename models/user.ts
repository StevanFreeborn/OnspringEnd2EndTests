export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Locked = 'Locked',
}

export class User {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly fullName: string;
  readonly status: UserStatus;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    status: UserStatus
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.fullName = `${firstName} ${lastName}`;
    this.status = status;
  }
}
