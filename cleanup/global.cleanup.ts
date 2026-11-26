/* eslint-disable playwright/no-skipped-test */
/* eslint-disable playwright/expect-expect */
import {
  ApiKeyTasks,
  AppTasks,
  ContainerTasks,
  DashboardObjectTasks,
  DashboardTasks,
  DataConnectorTasks,
  DataImportTasks,
  EmailSendingDomainTasks,
  EmailSyncTasks,
  EmailTemplateTasks,
  GroupTasks,
  KeyMetricTasks,
  RoleTasks,
  SendingNumberTasks,
  SharedListTasks,
  SurveyTasks,
  UserTasks,
} from '@stevanfreeborn/onspring-ui';
import { env } from '../env';
import { test as teardown } from '../fixtures';
import { Tags } from '../tests/tags';

const THIRTY_MINUTES = 30 * 60 * 1000;

teardown.setTimeout(THIRTY_MINUTES);

teardown.describe('cleanup', () => {
  teardown('cleanup:apps delete all apps created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(AppTasks.deleteAllTestApps());
  });

  teardown('cleanup:surveys delete all surveys created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SurveyTasks.deleteAllTestSurveys());
  });

  teardown('cleanup:groups delete all groups created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(GroupTasks.deleteAllTestGroups());
  });

  teardown('cleanup:roles delete all roles created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(RoleTasks.deleteAllTestRoles());
  });

  teardown('cleanup:users delete all users created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(UserTasks.deleteAllTestUsers());
  });

  teardown('cleanup:api-keys delete all api keys created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(ApiKeyTasks.deleteAllTestApiKeys());
  });

  teardown('cleanup:containers delete all containers created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(ContainerTasks.deleteAllTestContainers());
  });

  teardown('cleanup:data-imports delete all data imports created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataImportTasks.deleteAllTestImports());
  });

  teardown('cleanup:lists delete all lists created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SharedListTasks.deleteAllTestLists());
  });

  teardown(
    'cleanup:sendingNumbers delete all sending numbers created as part of tests',
    {
      tag: [Tags.NotFedRAMP],
    },
    async ({ sysAdminActor, environment }) => {
      teardown.skip(environment.isFedspring(), 'This is not applicable to the FEDSPRING environment');

      await sysAdminActor.attemptsTo(SendingNumberTasks.deleteAllTestNumbers());
    }
  );

  teardown('cleanup:connectors delete all data connectors created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataConnectorTasks.deleteAllTestConnectors());
  });

  teardown('cleanup:dashboards delete all test dashboards created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DashboardTasks.deleteAllTestDashboards());
  });

  teardown(
    'cleanup:dashboardObjects delete all test dashboard objects created as part of tests',
    async ({ sysAdminActor }) => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.deleteAllTestDashboardObjects());
    }
  );

  teardown('cleanup:KeyMetrics delete all test key metrics created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(KeyMetricTasks.deleteAllTestKeyMetrics());
  });

  teardown('cleanup:emailTemplates delete all email templates created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(EmailTemplateTasks.deleteAllTestTemplates());
  });

  teardown('cleanup:emailSyncs delete all email syncs created as part of tests', async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(EmailSyncTasks.deleteAllTestEmailSyncs());
  });

  teardown(
    'cleanup:emailSendingDomains delete all email sending domains created as part of tests',
    {
      tag: [Tags.NotFedRAMP],
    },
    async ({ sysAdminActor, environment }) => {
      teardown.skip(environment.isFedspring(), 'This is not applicable to the FEDSPRING environment');

      await sysAdminActor.attemptsTo(
        EmailSendingDomainTasks.deleteAllTestEmailSendingDomains(env.CUSTOM_EMAIL_SENDING_DOMAIN)
      );
    }
  );
});
