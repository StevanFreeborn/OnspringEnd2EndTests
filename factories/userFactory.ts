import { env } from '../env';
import { User, UserStatus } from '../models/user';
import { FakeDataFactory } from './fakeDataFactory';

export class UserFactory {
  static createSysAdminUser() {
    const firstName = env.SYS_ADMIN_FIRST_NAME ?? FakeDataFactory.createFakeFirstName();
    const lastName = env.SYS_ADMIN_LAST_NAME ?? FakeDataFactory.createFakeLastName();
    const email = env.SYS_ADMIN_EMAIL ?? FakeDataFactory.createFakeUserEmail();
    const username = env.SYS_ADMIN_USERNAME ?? FakeDataFactory.createFakeUsername();
    const password = env.SYS_ADMIN_PASSWORD ?? FakeDataFactory.createFakePassword();

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
