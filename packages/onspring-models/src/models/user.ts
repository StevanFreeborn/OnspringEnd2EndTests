export type UserStatus = 'Active' | 'Inactive' | 'Locked';

export type UserObject = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  status?: UserStatus;
  roles?: string[];
  sysAdmin?: boolean;
};

export class User {
  id: number;
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

  constructor({
    id = 0,
    firstName,
    lastName,
    email,
    username,
    password,
    status = 'Active',
    roles = [],
    sysAdmin = false,
  }: UserObject) {
    this.id = id;
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

