import { App, FakeDataFactory, ReferenceField, User } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentTasks,
  FieldTasks,
  SystemReportQuestions,
  UserUsageReportTargets,
  UserUsageReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type UserUsageReportTestFixtures = {
  app: App;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<UserUsageReportTestFixtures>({
  app: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('user usage report', () => {
  test('Filter the user usage report', async ({ sysAdminActor, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-886',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await sysAdminActor.attemptsTo(UserUsageReportTasks.goto());
    });

    await test.step('Filter the user usage report', async () => {
      await sysAdminActor.attemptsTo(
        UserUsageReportTasks.filterReport({
          name: sysAdminUser.fullName,
          status: 'Active',
          tier: 'Full User',
        })
      );
    });

    await test.step('Verify the report is filtered', async () => {
      await sysAdminActor.browse().check(UserUsageReportTargets.rows).hasCount(1);
      await sysAdminActor.browse().check(UserUsageReportTargets.rowAt(0)).hasText(new RegExp(sysAdminUser.fullName));
    });
  });

  test('Sort the user usage report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-887',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await sysAdminActor.attemptsTo(UserUsageReportTasks.goto());
    });

    await test.step('Sort the user usage report', async () => {
      await sysAdminActor.attemptsTo(
        UserUsageReportTasks.filterReport({ status: 'Active' }),
        UserUsageReportTasks.clearSort(),
        UserUsageReportTasks.sortGridBy('Username', 'ascending')
      );
    });

    await test.step('Verify the report is sorted', async () => {
      const usernames = await sysAdminActor.browse().getAllTexts(UserUsageReportTargets.usernameCells);
      const sortedUsernames = [...usernames].sort((a, b) => a.localeCompare(b));

      expect(usernames).toEqual(sortedUsernames);
    });
  });

  test('Click on the Usage link for a user in the report to view the usage details', async ({
    sysAdminActor,
    sysAdminUser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-888',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await sysAdminActor.attemptsTo(UserUsageReportTasks.goto());
    });

    await test.step('Click on the Usage link for a user', async () => {
      await sysAdminActor.attemptsTo(
        UserUsageReportTasks.filterReport({ name: sysAdminUser.fullName, status: 'Active' }),
        UserUsageReportTasks.openUsageDialogForUser(sysAdminUser.fullName)
      );
    });

    await test.step('Verify the usage details dialog is displayed', async () => {
      await sysAdminActor.browse().check(UserUsageReportTargets.usageDialog.dialog).isVisible();
    });
  });

  test('Click on a "Link" link within the usage details dialog', async ({ app, sysAdminActor, user: testUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-889',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const referenceField = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: 'Users',
    });

    await test.step("Create a reference field to the user's app", async () => {
      await createReferenceFieldToUsersApp(sysAdminActor, app, tabName, sectionName, referenceField);
    });

    await test.step('Create a record with a reference to a user', async () => {
      await createRecordWithReferenceToUser(sysAdminActor, app, tabName, sectionName, referenceField, testUser);
    });

    await test.step('Navigate to the user usage report page', async () => {
      await sysAdminActor.attemptsTo(UserUsageReportTasks.goto());
    });

    await test.step('Click on the Usage link for a user', async () => {
      await sysAdminActor.attemptsTo(
        UserUsageReportTasks.filterReport({ name: testUser.fullName, status: 'Active' }),
        UserUsageReportTasks.openUsageDialogForUser(testUser.fullName)
      );
    });

    await test.step('Verify that clicking on the "Link" link within the usage details dialog takes the user to the correct page', async () => {
      await sysAdminActor
        .browse()
        .check(UserUsageReportTargets.usageDialog.contentReferenceLink(app.name))
        .opensNewTabWithUrl(/\/Report\/[a-f0-9]{24}\/DisplayTemp/);
    });
  });

  test('Export the User Usage details for a user', async ({
    app,
    sysAdminActor,
    user: testUser,
    testUserActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-890',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const referenceField = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: 'Users',
    });

    await test.step("Create a reference field to the user's app", async () => {
      await createReferenceFieldToUsersApp(sysAdminActor, app, tabName, sectionName, referenceField);
    });

    await test.step('Create a record with a reference to a user', async () => {
      await createRecordWithReferenceToUser(sysAdminActor, app, tabName, sectionName, referenceField, testUser);
    });

    await test.step('Navigate to the user usage report page', async () => {
      await testUserActor.attemptsTo(UserUsageReportTasks.goto());
    });

    await test.step('Click on the Usage link for a user', async () => {
      await testUserActor.attemptsTo(
        UserUsageReportTasks.filterReport({ name: testUser.fullName, status: 'Active' }),
        UserUsageReportTasks.openUsageDialogForUser(testUser.fullName)
      );
    });

    await test.step('Click the Export button within the usage details dialog', async () => {
      await testUserActor.attemptsTo(UserUsageReportTasks.exportFromUsageDialog());
    });

    let exportEmailContent: string;

    await test.step('Verify the user usage details are exported', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', testUser.email],
          ['SUBJECT', 'Onspring Report Export Complete'],
          ['TEXT', `User Usage Report`],
          ['UNSEEN'],
        ];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });

    let reportPath: string;

    await test.step('Download the exported user usage details', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath, false);
      expect(reportData).toMatchObject([
        {
          name: 'Content References',
          data: [
            {
              '0': `Username: ${testUser.fullName} / ${testUser.username}`,
            },
            {},
            {
              '0': 'Content References',
            },
            {
              '0': 'App/Survey',
              '1': 'Field Name',
              '2': 'Record Count',
              '3': 'Report Link',
            },
            {
              '0': app.name,
              '1': referenceField.name,
              '2': 1,
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Apps',
          data: [
            {
              '0': 'App',
              '1': 'Type',
              '2': 'Name',
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Integration',
          data: [
            {
              '0': 'Apps',
              '1': 'Type',
              '2': 'Name',
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Dashboard',
          data: [
            {
              '0': 'Name',
              '1': 'Type',
              '2': 'Link',
            },
          ],
        },
      ]);
    });
  });
});

async function createReferenceFieldToUsersApp(
  actor: WebActor,
  app: App,
  tabName: string,
  sectionName: string,
  referenceField: ReferenceField
) {
  await actor.attemptsTo(
    AppTasks.gotoAppLayoutTab(app.id),
    FieldTasks.addFromGrid(referenceField),
    AppTasks.openLayoutDesigner(),
    AppTasks.dragFieldOntoLayout({
      fieldName: referenceField.name,
      tabName,
      sectionName,
      column: 0,
      row: 0,
    }),
    AppTasks.saveAndCloseLayout()
  );
}

async function createRecordWithReferenceToUser(
  actor: WebActor,
  app: App,
  tabName: string,
  sectionName: string,
  referenceField: ReferenceField,
  testUser: User
) {
  await actor.attemptsTo(
    ContentTasks.gotoAdd(app.id),
    ContentTasks.selectReferenceField({
      tabName,
      sectionName,
      fieldName: referenceField.name,
      searchTerm: testUser.fullName,
      controlType: 'radio',
    }),
    ContentTasks.saveRecord()
  );
}
