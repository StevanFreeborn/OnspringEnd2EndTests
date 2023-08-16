import { User } from '../models/user';
import { FakeDataFactory } from './fakeDataFactory';

export class UserFactory {
  static createSysAdminUser() {
    const username =
      process.env.SYS_ADMIN_USERNAME ?? FakeDataFactory.createFakeUsername();
    const password =
      process.env.SYS_ADMIN_PASSWORD ?? FakeDataFactory.createFakePassword();
    const fullName =
      process.env.SYS_ADMIN_FULLNAME ?? FakeDataFactory.createFakeFullName();
    return new User(username, password, fullName);
  }
}
