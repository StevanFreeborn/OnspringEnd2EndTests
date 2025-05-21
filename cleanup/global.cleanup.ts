import { test as teardown } from '../fixtures';
import { ApiKeysAdminPage } from '../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AppsAdminPage } from '../pageObjectModels/apps/appsAdminPage';
import { ContainersAdminPage } from '../pageObjectModels/containers/containersAdminPage';
import { DashboardsAdminPage } from '../pageObjectModels/dashboards/dashboardsAdminPage';
import { DataConnectorAdminPage } from '../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { DataImportsAdminPage } from '../pageObjectModels/dataImports/dataImportsAdminPage';
import { GroupsSecurityAdminPage } from '../pageObjectModels/groups/groupsSecurityAdminPage';
import { SendingNumberAdminPage } from '../pageObjectModels/messaging/sendingNumberAdminPage';
import { RolesSecurityAdminPage } from '../pageObjectModels/roles/rolesSecurityAdminPage';
import { SharedListAdminPage } from '../pageObjectModels/sharedLists/sharedListAdminPage';
import { SurveysAdminPage } from '../pageObjectModels/surveys/surveysAdminPage';
import { UsersSecurityAdminPage } from '../pageObjectModels/users/usersSecurityAdminPage';

const THIRTY_MINUTES = 30 * 60 * 1000;

teardown.setTimeout(THIRTY_MINUTES);

teardown.describe('cleanup', () => {
  teardown('cleanup:apps delete all apps created as part of tests', async ({ sysAdminPage }) => {
    await new AppsAdminPage(sysAdminPage).deleteAllTestApps();
  });

  teardown('cleanup:surveys delete all surveys created as part of tests', async ({ sysAdminPage }) => {
    await new SurveysAdminPage(sysAdminPage).deleteAllTestSurveys();
  });

  teardown('cleanup:groups delete all groups created as part of tests', async ({ sysAdminPage }) => {
    await new GroupsSecurityAdminPage(sysAdminPage).deleteAllTestGroups();
  });

  teardown('cleanup:roles delete all roles created as part of tests', async ({ sysAdminPage }) => {
    await new RolesSecurityAdminPage(sysAdminPage).deleteAllTestRoles();
  });

  teardown('cleanup:users delete all users created as part of tests', async ({ sysAdminPage }) => {
    await new UsersSecurityAdminPage(sysAdminPage).deleteAllTestUsers();
  });

  teardown('cleanup:api-keys delete all api keys created as part of tests', async ({ sysAdminPage }) => {
    await new ApiKeysAdminPage(sysAdminPage).deleteAllTestApiKeys();
  });

  teardown('cleanup:containers delete all containers created as part of tests', async ({ sysAdminPage }) => {
    await new ContainersAdminPage(sysAdminPage).deleteAllTestContainers();
  });

  teardown('cleanup:data-imports delete all data imports created as part of tests', async ({ sysAdminPage }) => {
    await new DataImportsAdminPage(sysAdminPage).deleteAllTestImports();
  });

  teardown('cleanup:lists delete all lists created as part of tests', async ({ sysAdminPage }) => {
    await new SharedListAdminPage(sysAdminPage).deleteAllTestLists();
  });

  teardown('cleanup:sendingNumbers delete all sending numbers created as part of tests', async ({ sysAdminPage }) => {
    await new SendingNumberAdminPage(sysAdminPage).deleteAllTestNumbers();
  });

  teardown('cleanup:connectors delete all data connectors created as part of tests', async ({ sysAdminPage }) => {
    await new DataConnectorAdminPage(sysAdminPage).deleteAllTestConnectors();
  });

  teardown('cleanup:dashboards delete all test dashboards created as part of tests', async ({ sysAdminPage }) => {
    await new DashboardsAdminPage(sysAdminPage).deleteAllTestDashboards();
  });

  teardown('cleanup:dashboardObjects delete all test dashboard objects created as part of tests', async ({ sysAdminPage }) => {
    await new DashboardsAdminPage(sysAdminPage).deleteAllTestDashboardObjects();
  });
});
