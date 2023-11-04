import { Page, test as base } from '@playwright/test';
import { sysAdminPage } from './auth.fixtures';

type Fixtures = {
  sysAdminPage: Page;
  createNewPage: (authStorageLocation?: string) => Promise<Page>;
};

export * from '@playwright/test';
export const test = base.extend<Fixtures>({
  sysAdminPage: sysAdminPage,
});
