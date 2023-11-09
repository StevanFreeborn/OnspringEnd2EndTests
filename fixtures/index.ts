import { Page, test as base } from '@playwright/test';
import { App } from '../models/app';
import { Role } from '../models/role';
import { User } from '../models/user';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';
import { app, appAdminPage } from './app.fixtures';
import { sysAdminPage, testUserPage } from './auth.fixtures';
import { jpgFilePath } from './file.fixtures';
import { activeRoleWithPermissions } from './role.fixures';
import { activeUserWithRole } from './user.fixtures';

type Fixtures = {
  sysAdminPage: Page;
  jpgFilePath: string;
};

type FieldTestFixtures = {
  appAdminPage: AppAdminPage;
  app: App;
  role: Role;
  user: User;
  testUserPage: Page;
};

export const test = base.extend<Fixtures>({
  sysAdminPage: sysAdminPage,
  jpgFilePath: jpgFilePath,
});

export const fieldTest = test.extend<FieldTestFixtures>({
  appAdminPage: appAdminPage,
  app: app,
  role: activeRoleWithPermissions,
  user: activeUserWithRole,
  testUserPage: testUserPage,
});

export type ApiTestOptions = {
  apiURL: string | undefined;
};

export const apiTest = base.extend<ApiTestOptions>({
  apiURL: ['', { option: true }],
});

export * from '@playwright/test';
