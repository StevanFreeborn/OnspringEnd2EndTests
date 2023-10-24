import { User, UserStatus } from '../models/user';
import { FakeDataFactory } from './fakeDataFactory';

export class UserFactory {
  static createSysAdminUser() {
    const firstName = process.env.SYS_ADMIN_FIRST_NAME ?? FakeDataFactory.createFakeFirstName();
    const lastName = process.env.SYS_ADMIN_LAST_NAME ?? FakeDataFactory.createFakeLastName();
    const email = process.env.SYS_ADMIN_EMAIL ?? FakeDataFactory.createFakeEmail();
    const username = process.env.SYS_ADMIN_USERNAME ?? FakeDataFactory.createFakeUsername();
    const password = process.env.SYS_ADMIN_PASSWORD ?? FakeDataFactory.createFakePassword();

    return new User(firstName, lastName, email, username, password, UserStatus.Active);
  }

  static createNewUser(status: UserStatus) {
    const firstName = FakeDataFactory.createFakeFirstName();
    const lastName = FakeDataFactory.createFakeLastName();
    const email = FakeDataFactory.createFakeEmail();
    const username = FakeDataFactory.createFakeUsername();
    const password = FakeDataFactory.createFakePassword();

    return new User(firstName, lastName, email, username, password, status);
  }
}
