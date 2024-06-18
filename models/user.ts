export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Locked = 'Locked',
}

export class User {
  id: number = 0;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly fullName: string;
  readonly status: UserStatus;
  readonly roles: string[];
  readonly sysAdmin: boolean;
  authStoragePath?: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    status: UserStatus,
    roles: string[] = [],
    sysAdmin: boolean = false
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.fullName = `${firstName} ${lastName}`;
    this.status = status;
    this.roles = roles;
    this.sysAdmin = sysAdmin;
  }
}
