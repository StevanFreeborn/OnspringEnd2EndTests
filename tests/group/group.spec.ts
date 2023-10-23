import { test as base } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';

type GroupTestFixtures = {
  adminHomePage: AdminHomePage;
};

const test = base.extend<GroupTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
});

test.describe('Role', () => {
  let groupsToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async () => {
    // TODO: Implement deleteGroups method
    // await groupsSecurityAdminPage.deleteGroups(groupsToDelete);
    groupsToDelete = [];
  });

  test('Create a Group via the create button in the header of the admin home page', async ({}) => {});

  test('Delete a Group', async ({}) => {});
});
