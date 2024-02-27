import { faker } from '@faker-js/faker';

export const TEST_APP_NAME = 'app-test';
export const TEST_SURVEY_NAME = 'survey-test';
export const TEST_USER_NAME = 'user-test';
export const TEST_ROLE_NAME = 'role-test';
export const TEST_GROUP_NAME = 'group-test';
export const TEST_API_KEY_NAME = 'api-key-test';
export const TEST_CONTAINER_NAME = 'container-test';
export const TEST_DATA_IMPORT_NAME = 'data-import-test';
export const TEST_EMAIL_BODY_NAME = 'email-body-test';

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
    return `${uniqueId}-${TEST_USER_NAME}`;
  }

  static createFakePassword() {
    return faker.internet.password({ length: 10 });
  }

  static createFakeEmail() {
    return faker.internet.email();
  }

  static createFakeAppName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_APP_NAME}`;
  }

  static createFakeSurveyName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_SURVEY_NAME}`;
  }

  static createFakeGroupName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_GROUP_NAME}`;
  }

  static createFakeRoleName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_ROLE_NAME}`;
  }

  static createFakeFieldName(fieldName: string = 'field-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${fieldName}`;
  }

  static createFakeQuestionId(questionText: string = 'question-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${questionText}`;
  }

  static createFakeTextBlockName(fieldName: string = 'text-block-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${fieldName}`;
  }

  static createFakeApiKeyName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_API_KEY_NAME}`;
  }

  static createFakeSurveyPageName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-page-test`;
  }

  static createFakeContainerName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_CONTAINER_NAME}`;
  }

  static createFakeDataImportName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_DATA_IMPORT_NAME}`;
  }

  static createFakeEmailBodyName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_EMAIL_BODY_NAME}`;
  }
}
