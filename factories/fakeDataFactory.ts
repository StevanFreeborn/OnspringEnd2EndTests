import { faker } from '@faker-js/faker';

export class FakeDataFactory {
  static createFakeFirstName() {
    return faker.person.firstName();
  }

  static createFakeLastName() {
    return faker.person.lastName();
  }

  static createFakeUsername() {
    return faker.internet.userName();
  }

  static createFakePassword() {
    return faker.internet.password({ length: 10 });
  }

  static createFakeEmail() {
    return faker.internet.email();
  }

  static createFakeAppName() {
    const timestamp = new Date().getTime().toString();
    const id = faker.database.mongodbObjectId();
    return `${timestamp}-${id}-app-test`;
  }
}
