import { test as base } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';

type RoleTestFixtures = {
  adminHomePage: AdminHomePage;
};

const test = base.extend<RoleTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
});

test.describe('Role', () => {
  let rolesToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async () => {
    // TODO: Implement deleteRoles method
    // await rolesSecurityAdminPage.deleteRoles(rolesToDelete);
    rolesToDelete = [];
  });

  test('Create a Role via the create button in the header of the admin home page', async ({}) => {});

  test('Delete a Role', async ({}) => {});
});
