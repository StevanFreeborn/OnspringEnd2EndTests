import { App, User } from '@stevanfreeborn/onspring-models';
import { AppLayoutTabTargets, AppQuestions, AppTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, UserFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type FieldsAndObjectsReportTestFixtures = {
  app: App;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<FieldsAndObjectsReportTestFixtures>({
  app: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().withName('TestUser').build(),
});

test.describe('fields & objects report', () => {
  test("Search an app's Fields & Objects report", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-53',
    });

    await test.step('Navigate to the app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
    });

    await test.step('Search for a field in the Fields & Objects report', async () => {
      await sysAdminActor.attemptsTo(AppTasks.searchFieldsAndObjectsReport('Record Id'));
    });

    await test.step('Verify the field is found in the report', async () => {
      await sysAdminActor.browse().check(AppLayoutTabTargets.fieldsAndObjectsGridRows).hasCount(1);
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.fieldOrObjectRowByName(/Record Id/i))
        .isVisible();
    });
  });

  test("Export an app's Fields & Objects report, including the usage.", async ({
    app,
    user,
    testUserActor,
    sysAdminEmail,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-54',
    });

    await test.step('Navigate to the app admin page', async () => {
      await testUserActor.attemptsTo(AppTasks.gotoApp(app.id));
    });

    await test.step('Export the Fields & Objects report', async () => {
      await testUserActor.attemptsTo(
        AppTasks.exportFieldsAndObjectsReport({
          format: 'PDF',
          fields: ['Name'],
          includeUsage: true,
        })
      );
    });

    let exportEmailContent: string;

    await test.step('Verify the report is exported successfully', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', user.email], ['TEXT', `${app.name} Field Report`], ['UNSEEN']];
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

    await test.step('Download the exported report', async () => {
      const report = await testUserActor.asks(
        AppQuestions.downloadedFieldsAndObjectsExportFromEmailHtml(exportEmailContent)
      );
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify the downloaded report contains the expected data', async () => {
      const expectedText = ['Record Id', 'General Data', 'Usage Data'];
      const foundExpectedText = await pdfParser.findTextInPDF(reportPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });
});
