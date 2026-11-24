import { Page, test as base } from '@playwright/test';
import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { App } from '../models/app';
import { Role } from '../models/role';
import { Survey } from '../models/survey';
import { User } from '../models/user';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';
import { SurveyAdminPage } from '../pageObjectModels/surveys/surveyAdminPage';
import { DownloadService } from '../services/downloadService';
import { DynamicDocumentService } from '../services/dynamicDocumentService';
import { EmailService } from '../services/emailService';
import { PdfParser } from '../services/pdfParser';
import { RemoteTestFileService } from '../services/remoteTestFileService';
import { SftpService } from '../services/sftpService';
import { SheetParser } from '../services/sheetParser';
import { env } from './../env';
import { app, appAdminPage } from './app.fixtures';
import { createTestUserPageFixture, sysAdminPage } from './auth.fixtures';
import { TestFile, jpgFile, large149mbTxtFile, large151mbTxtFile, txtFile } from './file.fixtures';
import { activeRoleWithPermissions } from './role.fixtures';
import {
  downloadService,
  dynamicDocumentService,
  pdfParser,
  remoteTestFileService,
  sftpService,
  sheetParser,
  sysAdminEmailService,
} from './services.fixtures';
import { survey } from './survey.fixtures';
import { activeUserWithRole } from './user.fixtures';

FakeDataFactory.configure({
  defaultEmailSendingDomain: env.TEST_ENV === 'FEDSPRING_IST' ? 'fedspring.ist' : 'onspring.tech',
  customEmailSendingDomain: env.CUSTOM_EMAIL_SENDING_DOMAIN,
  sysAdminEmail: env.SYS_ADMIN_EMAIL,
});

type Environment = {
  getEnvironment: () => typeof env.TEST_ENV;
  isFedspring: () => boolean;
};

export type ApiTestOptions = {
  apiURL: string;
  useCachedApiSetup: boolean;
};

type Fixtures = {
  environment: Environment;
  sysAdminUser: User;
  sysAdminPage: Page;
  sysAdminActor: WebActor;
  sysAdminEmail: EmailService;
  pdfParser: PdfParser;
  sheetParser: SheetParser;
  downloadService: DownloadService;
  dynamicDocumentService: DynamicDocumentService;
  remoteTestFileService: RemoteTestFileService;
  sftpService: SftpService;
  jpgFile: TestFile;
  txtFile: TestFile;
  large149mbTxtFile: TestFile;
  large151mbTxtFile: TestFile;
  apiURL: string;
  useCachedApiSetup: boolean;
};

type FieldTestFixtures = {
  appAdminPage: AppAdminPage;
  app: App;
  role: Role;
  user: User;
  testUserPage: Page;
};

type QuestionTestFixtures = {
  surveyAdminPage: SurveyAdminPage;
  sourceSurvey: Survey;
  targetSurvey: Survey;
};

export const test = base.extend<Fixtures>({
  environment: {
    getEnvironment: () => env.TEST_ENV,
    isFedspring: () => env.TEST_ENV === 'FEDSPRING_IST',
  },
  sysAdminUser: async ({}, use) => {
    const adminUser = new User({
      firstName: env.SYS_ADMIN_FIRST_NAME,
      lastName: env.SYS_ADMIN_LAST_NAME,
      email: env.SYS_ADMIN_EMAIL,
      username: env.SYS_ADMIN_USERNAME,
      password: env.SYS_ADMIN_PASSWORD,
      status: 'Active',
      sysAdmin: true,
    });
    await use(adminUser);
  },
  sysAdminPage: sysAdminPage,
  sysAdminActor: async ({ sysAdminPage }, use) => {
    const actor = WebActor.using('SysAdmin', sysAdminPage);
    await use(actor);
  },
  sysAdminEmail: sysAdminEmailService,
  pdfParser: pdfParser,
  sheetParser: sheetParser,
  downloadService: downloadService,
  dynamicDocumentService: dynamicDocumentService,
  remoteTestFileService: remoteTestFileService,
  sftpService: sftpService,
  jpgFile: jpgFile,
  txtFile: txtFile,
  large149mbTxtFile: large149mbTxtFile,
  large151mbTxtFile: large151mbTxtFile,
  apiURL: ['', { option: true }],
});

export const layoutItemTest = test.extend<FieldTestFixtures>({
  appAdminPage: appAdminPage,
  app: app,
  role: activeRoleWithPermissions,
  user: activeUserWithRole,
  testUserPage: createTestUserPageFixture,
});

export const surveyQuestionTest = test.extend<QuestionTestFixtures>({
  surveyAdminPage: async ({ sysAdminPage }, use) => {
    const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
    await use(surveyAdminPage);
  },
  sourceSurvey: survey,
  targetSurvey: survey,
});

export { expect } from './matchers.fixtures';
export { ActorFixture, ActorFixtureBuilder, createAuthenticatedActor } from './auth.fixtures';
export { AppFixture, AppFixtureBuilder } from './app.fixtures';
export { FieldFixture, FieldFixtureBuilder, createFieldsWithActor } from './field.fixtures';
export type { FieldLayoutPlacement } from './field.fixtures';
export { RoleFixture, RoleFixtureBuilder } from './role.fixtures';
export { SharedListFixture, SharedListFixtureBuilder, sharedList } from './sharedList.fixtures';
export { UserFixture, UserFixtureBuilder, user } from './user.fixtures';
export { ContainerFixture, ContainerFixtureBuilder, container } from './container.fixtures';
export { EmailTemplateFixture, EmailTemplateFixtureBuilder, emailTemplate } from './emailTemplate.fixtures';
export {
  EmailSendingDomainFixture,
  EmailSendingDomainFixtureBuilder,
  emailSendingDomain,
} from './emailSendingDomain.fixtures';
export { EmailSyncFixture, EmailSyncFixtureBuilder, emailSync } from './emailSync.fixtures';
export { EmailBodyFixture, EmailBodyFixtureBuilder } from './emailBody.fixtures';
export { SendingNumberFixture, SendingNumberFixtureBuilder, sendingNumber } from './sendingNumber.fixtures';
export { TextMessageFixture, TextMessageFixtureBuilder } from './textMessage.fixtures';
export { SlackMessageFixture, SlackMessageFixtureBuilder } from './slackMessage.fixtures';
export { DashboardFixture, DashboardFixtureBuilder } from './dashboard.fixtures';
export { DynamicDocumentFixture, DynamicDocumentFixtureBuilder } from './dynamicDocument.fixtures';
export { DataConnectorFixture, DataConnectorFixtureBuilder } from './dataConnector.fixtures';
export type { DataConnectorFixtureData } from './dataConnector.fixtures';
export { DataImportFixture, DataImportFixtureBuilder, dataImport } from './dataImport.fixtures';
export type { DataImportFixtureData } from './dataImport.fixtures';
export { SurveyFixture, SurveyFixtureBuilder, createSurveyWithActor } from './survey.fixtures';
export { ReportFixture, ReportFixtureBuilder } from './report.fixtures';

export * from '@playwright/test';
