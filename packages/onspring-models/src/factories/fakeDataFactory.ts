import { faker } from '@faker-js/faker';
import { User, UserStatus } from '../models/user.js';

export const TEST_APP_NAME = 'app-test';
export const TEST_SURVEY_NAME = 'survey-test';
export const TEST_USER_NAME = 'user-test';
export const TEST_ROLE_NAME = 'role-test';
export const TEST_GROUP_NAME = 'group-test';
export const TEST_API_KEY_NAME = 'api-key-test';
export const TEST_CONTAINER_NAME = 'container-test';
export const TEST_DATA_IMPORT_NAME = 'data-import-test';
export const TEST_EMAIL_BODY_NAME = 'email-body-test';
export const TEST_LIST_NAME = 'list-test';
export const TEST_SENDING_NUMBER_NAME = 'sending-number-test';
export const TEST_TEXT_MESSAGE_NAME = 'text-message-test';
export const TEST_CONNECTOR_NAME = 'connector-test';
export const TEST_DASHBOARD_NAME = 'dashboard-test';
export const TEST_DASHBOARD_OBJECT_NAME = 'object-test';
export const TEST_EMAIL_TEMPLATE_NAME = 'email-template-test';
export const TEST_EMAIL_SYNC_NAME = 'email-sync-test';
export const TEST_KEY_METRIC_NAME = 'key-metric-test';
export const TEST_SLACK_MESSAGE_NAME = 'slack-message-test';
export const TEST_DASHBOARD_FILTER_LABEL = 'dashboard-filter-test';

export type FakeDataConfig = {
  defaultEmailSendingDomain?: string;
  customEmailSendingDomain?: string;
  sysAdminEmail?: string;
};

export class FakeDataFactory {
  private static config: FakeDataConfig = {
    defaultEmailSendingDomain: 'onspring.tech',
    customEmailSendingDomain: 'custom.onspring.tech',
    sysAdminEmail: 'automation@onspring.tech',
  };

  static configure(config: FakeDataConfig) {
    this.config = { ...this.config, ...config };
  }

  static get defaultEmailSendingDomain(): string {
    return this.config.defaultEmailSendingDomain ?? 'onspring.tech';
  }

  static get customEmailSendingDomain(): string {
    return this.config.customEmailSendingDomain ?? 'custom.onspring.tech';
  }

  static get sysAdminEmail(): string {
    return this.config.sysAdminEmail ?? 'automation@onspring.tech';
  }

  static createUniqueIdentifier() {
    const timestamp = new Date().getTime().toString();
    const id = faker.database.mongodbObjectId();
    return `${timestamp}-${id}`;
  }

  static createFakeDashboardFilterLabel(): string {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_DASHBOARD_FILTER_LABEL}`;
  }

  static createFakeKeyMetricName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_KEY_METRIC_NAME}`;
  }

  static createFakeRecordRetentionRuleName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-record-retention-rule-test`;
  }

  static createFakeCustomEmailSendingDomain() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}.${this.customEmailSendingDomain}`;
  }

  static createFakeEmailSyncKey() {
    return faker.string.alphanumeric(20);
  }

  static createFakeEmailSyncName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_EMAIL_SYNC_NAME}`;
  }

  static createFakeSharedListName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-shared-list-test`;
  }

  static createFakeSendingNumberName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_SENDING_NUMBER_NAME}`;
  }

  static createFakeTextMessageName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_TEXT_MESSAGE_NAME}`;
  }

  static createFakeDataConnectorName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_CONNECTOR_NAME}`;
  }

  static createFakeEmailTemplateName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_EMAIL_TEMPLATE_NAME}`;
  }

  static createFakeDashboardName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_DASHBOARD_NAME}`;
  }

  static createFakeDashboardObjectName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_DASHBOARD_OBJECT_NAME}`;
  }

  static createFakeListName() {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${TEST_LIST_NAME}`;
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

  static createFakeUserEmail() {
    const sysAdminEmail = this.sysAdminEmail;
    const sysAdminEmailParts = sysAdminEmail.split('@');
    const username = sysAdminEmailParts[0];
    const domain = sysAdminEmailParts[1];
    return `${username}+${this.createUniqueIdentifier()}@${domain}`;
  }

  static createFakePassword() {
    return faker.internet.password({ length: 10 });
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

  static createFakeTextBlockName(textBlockName: string = 'text-block-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${textBlockName}`;
  }

  static createFakeSectionLabelName(sectionLabelName: string = 'section-label-test') {
    const uniqueId = this.createUniqueIdentifier();
    return `${uniqueId}-${sectionLabelName}`;
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

  static createFakeEmailFromAddress(username: string = 'automation') {
    return `${username}@${this.defaultEmailSendingDomain}`;
  }

  static createFakeTriggerName() {
    return `${this.createUniqueIdentifier()}-trigger-test`;
  }

  static createFakeDocumentName() {
    return `${this.createUniqueIdentifier()}-document-test`;
  }

  static createFakeUser(status: UserStatus = 'Active', sysAdmin: boolean = false): User {
    return new User({
      firstName: this.createFakeFirstName(),
      lastName: this.createFakeLastName(),
      email: this.createFakeUserEmail(),
      username: this.createFakeUsername(),
      password: this.createFakePassword(),
      status,
      sysAdmin,
    });
  }
}
