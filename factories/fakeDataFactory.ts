import { faker } from '@faker-js/faker';

export const TEST_SURVEY_NAME = 'survey-test';

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
    return `${uniqueId}-${faker.internet.userName()}`;
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

  static createFakeSurveyName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_SURVEY_NAME}`;
  }

  static createFakeGroupName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-group-test`;
  }

  static createFakeRoleName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-role-test`;
  }

  static createFakeFieldName(fieldName: string = 'field-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${fieldName}`;
  }

  static createFakeTextBlockName(fieldName: string = 'text-block-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${fieldName}`;
  }

  static createFakeApiKeyName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-api-key-test`;
  }
}
