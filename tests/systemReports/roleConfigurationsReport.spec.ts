import { Role, User } from '@stevanfreeborn/onspring-models';
import {
  EditRolePageTargets,
  RoleConfigurationsReportTargets,
  RoleConfigurationsReportTasks,
  SystemReportQuestions,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, expect, RoleFixture, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type RoleConfigurationReportTestFixtures = {
  user: User;
  testSystemAdminActor: WebActor;
  testRole: Role;
};

const test = base.extend<RoleConfigurationReportTestFixtures>({
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testSystemAdminActor: ActorFixture.forUser().build(),
  testRole: RoleFixture.create().withStatus('Active').build(),
});

test.describe('role configurations report', () => {
  test('Filter the role configurations report', async ({ sysAdminActor, testRole }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-633',
    });

    await test.step('Navigate to the role configurations report', async () => {
      await sysAdminActor.attemptsTo(RoleConfigurationsReportTasks.goto());
    });

    await test.step('Filter the role configurations report', async () => {
      await sysAdminActor.attemptsTo(RoleConfigurationsReportTasks.filterByName(testRole.name));
    });

    await test.step('Verify the role configurations report is filtered', async () => {
      await sysAdminActor.browse().check(RoleConfigurationsReportTargets.roleItemHeading(testRole.name)).isVisible();
    });
  });

  test('Edit a role in the role configurations report', async ({ sysAdminActor, testRole }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-635',
    });

    await test.step('Navigate to the role configurations report', async () => {
      await sysAdminActor.attemptsTo(RoleConfigurationsReportTasks.goto());
    });

    await test.step("Edit a role's configurations", async () => {
      await sysAdminActor.attemptsTo(RoleConfigurationsReportTasks.clickEditRole(testRole.name));
    });

    await test.step('Verify the role configurations have been updated', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.nameInput).hasValue(testRole.name);
    });
  });

  test('Export the role configurations report', async ({
    testRole,
    user: testSystemAdmin,
    testSystemAdminActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-636',
    });

    await test.step('Navigate to the role configurations report page', async () => {
      await testSystemAdminActor.attemptsTo(RoleConfigurationsReportTasks.goto());
    });

    await test.step('Export the role configurations report', async () => {
      await testSystemAdminActor.attemptsTo(RoleConfigurationsReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the role configurations report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testSystemAdmin.email], ['TEXT', 'Role Configurations'], ['UNSEEN']];
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

    await test.step('Download the exported role configurations report', async () => {
      const report = await testSystemAdminActor.asks(
        SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent)
      );
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData.length).toBeGreaterThan(0);

      const roleFound = reportData.some(sheet => {
        return sheet.data.some((row: Record<string, unknown>) => {
          const nameValue = row['Name'] ?? row['Role Name'] ?? row['Role'];
          return typeof nameValue === 'string' && nameValue.includes(testRole.name);
        });
      });

      expect(roleFound).toBe(true);
    });
  });
});
