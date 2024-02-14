import { test as teardown } from '../fixtures';
import { ApiKeysAdminPage } from '../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AppsAdminPage } from '../pageObjectModels/apps/appsAdminPage';
import { ContainersAdminPage } from '../pageObjectModels/containers/containersAdminPage';
import { GroupsSecurityAdminPage } from '../pageObjectModels/groups/groupsSecurityAdminPage';
import { RolesSecurityAdminPage } from '../pageObjectModels/roles/rolesSecurityAdminPage';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';
import { UsersSecurityAdminPage } from '../pageObjectModels/users/usersSecurityAdminPage';

const THIRTY_MINUTES = 30 * 60 * 1000;

teardown.setTimeout(THIRTY_MINUTES);

teardown.describe('cleanup', () => {
  teardown('delete all apps created as part of tests', async ({ sysAdminPage }) => {
    await new AppsAdminPage(sysAdminPage).deleteAllTestApps();
  });

  teardown('delete all surveys created as part of tests', async ({ sysAdminPage }) => {
    await new SurveysAdminPage(sysAdminPage).deleteAllTestSurveys();
  });

  teardown('delete all groups created as part of tests', async ({ sysAdminPage }) => {
    await new GroupsSecurityAdminPage(sysAdminPage).deleteAllTestGroups();
  });

  teardown('delete all roles created as part of tests', async ({ sysAdminPage }) => {
    await new RolesSecurityAdminPage(sysAdminPage).deleteAllTestRoles();
  });

  teardown('delete all users created as part of tests', async ({ sysAdminPage }) => {
    await new UsersSecurityAdminPage(sysAdminPage).deleteAllTestUsers();
  });

  teardown('delete all api keys created as part of tests', async ({ sysAdminPage }) => {
    await new ApiKeysAdminPage(sysAdminPage).deleteAllTestApiKeys();
  });

  teardown('delete all containers created as part of tests', async ({ sysAdminPage }) => {
    await new ContainersAdminPage(sysAdminPage).deleteAllTestContainers();
  });
});
