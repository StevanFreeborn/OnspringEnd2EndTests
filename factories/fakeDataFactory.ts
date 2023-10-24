import { faker } from '@faker-js/faker';

export class FakeDataFactory {
  static createUniqueIdentifier() {
    const timestamp = new Date().getTime().toString();
    const id = faker.database.mongodbObjectId();
    return `${timestamp}-${id}`;
  }

  static createFakeFirstName() {
    return faker.person.firstName();
  }

  static createFakeLastName() {
    return faker.person.lastName();
  }

  static createFakeUsername() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${faker.internet.userName()}}`;
  }

  static createFakePassword() {
    return faker.internet.password({ length: 10 });
  }

  static createFakeEmail() {
    return faker.internet.email();
  }

  static createFakeAppName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-app-test`;
  }

  static createFakeGroupName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${faker.company.name()}`;
  }

  static createFakeRoleName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${faker.person.jobTitle()}`;
  }
}
