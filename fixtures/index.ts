import { Page, test as base } from '@playwright/test';
import { App } from '../models/app';
import { Role } from '../models/role';
import { User } from '../models/user';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';
import { app, appAdminPage } from './app.fixtures';
import { sysAdminPage, testUserPage } from './auth.fixtures';
import { activeRoleWithPermissions } from './role.fixures';
import { activeUserWithRole } from './user.fixtures';

type Fixtures = {
  sysAdminPage: Page;
  createNewPage: (authStorageLocation?: string) => Promise<Page>;
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
});

export const fieldTest = test.extend<FieldTestFixtures>({
  appAdminPage: appAdminPage,
  app: app,
  role: activeRoleWithPermissions,
  user: activeUserWithRole,
  testUserPage: testUserPage,
});

export * from '@playwright/test';
