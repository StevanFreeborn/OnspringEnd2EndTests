import { Page, test as base } from '@playwright/test';
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
import { SheetParser } from '../services/sheetParser';
import { env } from './../env';
import { app, appAdminPage } from './app.fixtures';
import { sysAdminPage, testUserPage } from './auth.fixtures';
import { TestFile, jpgFile, txtFile } from './file.fixtures';
import { activeRoleWithPermissions } from './role.fixures';
import {
  downloadService,
  dynamicDocumentService,
  pdfParser,
  sheetParser,
  sysAdminEmailService,
} from './services.fixtures';
import { survey } from './survey.fixtures';
import { activeUserWithRole } from './user.fixtures';

type Environment = {
  getEnvironment: () => typeof env.TEST_ENV;
  isFedspring: () => boolean;
};

type Fixtures = {
  environment: Environment;
  sysAdminPage: Page;
  sysAdminEmail: EmailService;
  pdfParser: PdfParser;
  sheetParser: SheetParser;
  downloadService: DownloadService;
  dynamicDocumentService: DynamicDocumentService;
  jpgFile: TestFile;
  txtFile: TestFile;
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
  sysAdminPage: sysAdminPage,
  sysAdminEmail: sysAdminEmailService,
  pdfParser: pdfParser,
  sheetParser: sheetParser,
  downloadService: downloadService,
  dynamicDocumentService: dynamicDocumentService,
  jpgFile: jpgFile,
  txtFile: txtFile,
});

export const layoutItemTest = test.extend<FieldTestFixtures>({
  appAdminPage: appAdminPage,
  app: app,
  role: activeRoleWithPermissions,
  user: activeUserWithRole,
  testUserPage: testUserPage,
});

export const surveyQuestionTest = test.extend<QuestionTestFixtures>({
  surveyAdminPage: async ({ sysAdminPage }, use) => {
    const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
    await use(surveyAdminPage);
  },
  sourceSurvey: survey,
  targetSurvey: survey,
});

export type ApiTestOptions = {
  apiURL: string | undefined;
};

export const apiTest = base.extend<ApiTestOptions>({
  apiURL: ['', { option: true }],
});

export * from '@playwright/test';
