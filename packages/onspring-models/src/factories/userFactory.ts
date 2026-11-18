import { User, UserStatus } from '../models/user.js';
import { FakeDataFactory } from './fakeDataFactory.js';

export type UserFactoryConfig = {
  sysAdminFirstName?: string;
  sysAdminLastName?: string;
  sysAdminEmail?: string;
  sysAdminUsername?: string;
  sysAdminPassword?: string;
};

export class UserFactory {
  private static config: UserFactoryConfig = {};

  static configure(config: UserFactoryConfig) {
    this.config = { ...this.config, ...config };
  }

  static createSysAdminUser() {
    const firstName = this.config.sysAdminFirstName ?? FakeDataFactory.createFakeFirstName();
    const lastName = this.config.sysAdminLastName ?? FakeDataFactory.createFakeLastName();
    const email = this.config.sysAdminEmail ?? FakeDataFactory.createFakeUserEmail();
    const username = this.config.sysAdminUsername ?? FakeDataFactory.createFakeUsername();
    const password = this.config.sysAdminPassword ?? FakeDataFactory.createFakePassword();

    return new User(firstName, lastName, email, username, password, UserStatus.Active);
  }

  static createNewUser(status: UserStatus, sysAdmin: boolean = false) {
    const firstName = FakeDataFactory.createFakeFirstName();
    const lastName = FakeDataFactory.createFakeLastName();
    const email = FakeDataFactory.createFakeUserEmail();
    const username = FakeDataFactory.createFakeUsername();
    const password = FakeDataFactory.createFakePassword();

    return new User(firstName, lastName, email, username, password, status, [], sysAdmin);
  }
}
