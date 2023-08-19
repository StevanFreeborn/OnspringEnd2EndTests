import { faker } from '@faker-js/faker';

export class FakeDataFactory {
  static createFakeFullName() {
    return faker.name.fullName();
  }

  static createFakeUsername() {
    return faker.internet.userName();
  }

  static createFakePassword() {
    return faker.internet.password(10);
  }

  static createFakeAppName() {
    const timestamp = new Date().getTime().toString();
    const id = faker.database.mongodbObjectId();
    return `${timestamp}-${id}-app-test`;
  }
}
