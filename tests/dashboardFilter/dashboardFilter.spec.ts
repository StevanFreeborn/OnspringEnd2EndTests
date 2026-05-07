import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect, Page } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createTestUserPageFixture } from '../../fixtures/auth.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { createReportFixture } from '../../fixtures/report.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { Container } from '../../models/container';
import { TextDashboardFilter } from '../../models/dashboardFilter';
import { TextDashboardFilterCriteria } from '../../models/dashboardFilterCriteria';
import { SavedReport, SavedReportAsReportDataOnly } from '../../models/report';
import { TextField } from '../../models/textField';
import { User, UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';
import { Dashboard } from './../../models/dashboard';

type DashboardFilterTestFixtures = {
  sourceApp: App;
  testUser: User;
  testUserPage: Page;
  report: SavedReport;
  container: Container;
  dashboard: Dashboard;
  adminHomePage: AdminHomePage;
  dashboardsAdminPage: DashboardsAdminPage;
  dashboardPage: DashboardPage;
  appAdminPage: AppAdminPage;
};

const test = base.extend<DashboardFilterTestFixtures>({
  sourceApp: app,
  testUser: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        userStatus: UserStatus.Active,
        sysAdmin: true,
        roles: [],
      },
      use,
      testInfo
    );
  },
  testUserPage: async ({ browser, testUser }, use, testInfo) =>
    await createTestUserPageFixture({ browser, user: testUser }, use, testInfo),
  report: async ({ sysAdminPage, sourceApp }, use) =>
    await createReportFixture(
      {
        sysAdminPage,
        app: sourceApp,
        report: new SavedReportAsReportDataOnly({
          name: FakeDataFactory.createFakeReportName(),
          appName: sourceApp.name,
          security: 'Public',
        }),
      },
      use
    ),
  container: async ({ sysAdminPage }, use) => await createContainerFixture({ sysAdminPage }, use),
  dashboard: async ({ sysAdminPage, container, report }, use) =>
    await createDashboardFixture(
      {
        sysAdminPage,
        dashboard: new Dashboard({
          name: FakeDataFactory.createFakeDashboardName(),
          containers: [container.name],
          items: [
            {
              item: report,
              row: 0,
              column: 0,
            },
          ],
        }),
      },
      use
    ),
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  dashboardsAdminPage: async ({ sysAdminPage }, use) => await use(new DashboardsAdminPage(sysAdminPage)),
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('dashboard filter', () => {
  test('Enable dashboard filters', async ({ dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-751',
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Verify filter bar is present', async () => {
      await expect(dashboardPage.dashboardFilterBar).toBeVisible();
    });
  });

  test('Add a dashboard filter', async ({ dashboard, dashboardPage, report, sourceApp, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-752',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Verify dashboard filter was added', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toBeVisible();
    });
  });

  test('Update a dashboard filter', async ({ appAdminPage, sourceApp, dashboard, dashboardPage, report }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-753',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Verify dashboard filter was added', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toBeVisible();
    });

    const existingLabel = textDashboardFilter.label;
    textDashboardFilter.label = FakeDataFactory.createFakeDashboardFilterLabel();

    await test.step('Edit the dashboard filter', async () => {
      await dashboardPage.editDashboardFilterByLabel(existingLabel, textDashboardFilter);
    });

    await test.step('Verify the dashboard filter was edited', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toBeVisible();
    });
  });

  test('Move a dashboard filter', async ({ report, appAdminPage, sourceApp, dashboardPage, dashboard }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-754',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const firstDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });
    const secondDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });

    await test.step('Create the text field that will be mapped in the filters', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Add dashboard filters', async () => {
      await dashboardPage.addDashboardFilter(firstDashboardFilter);
      await dashboardPage.addDashboardFilter(secondDashboardFilter);
    });

    await test.step('Verify dashboard filters were added', async () => {
      const firstFilter = dashboardPage.getDashboardFilterByLabel(firstDashboardFilter.label);
      const secondFilter = dashboardPage.getDashboardFilterByLabel(secondDashboardFilter.label);

      await expect(firstFilter).toBeLeftOf(secondFilter);
    });

    await test.step('Move dashboard filter', async () => {
      await dashboardPage.moveDashboardFilterRight(firstDashboardFilter.label);
    });

    await test.step('Verify the dashboard filter was moved', async () => {
      const firstFilter = dashboardPage.getDashboardFilterByLabel(firstDashboardFilter.label);
      const secondFilter = dashboardPage.getDashboardFilterByLabel(secondDashboardFilter.label);

      await expect(firstFilter).toBeRightOf(secondFilter);
    });
  });

  test('Save default dashboard filter criteria for a dashboard', async ({
    report,
    appAdminPage,
    sourceApp,
    dashboardPage,
    dashboard,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-755',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });
    const filterCriteria = new TextDashboardFilterCriteria({
      filterLabel: textDashboardFilter.label,
      operator: 'Is Empty',
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Apply criteria to filter and save as dashboard default', async () => {
      await dashboardPage.applyFilterCriteria(filterCriteria);
      await dashboardPage.saveFilterCriteriaAsDefault();
    });

    await test.step('Navigate to the content tab', async () => {
      await dashboardPage.sidebar.contentTab.click();
    });

    await test.step('Navigate back to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the saved default criteria is applied', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toHaveText(new RegExp(`${filterCriteria.filterLabel}\\s+${filterCriteria.operator}`));
    });
  });

  test('Save end user default dashboard filter criteria for a dashboard', async ({
    report,
    appAdminPage,
    sourceApp,
    dashboardPage,
    dashboard,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-756',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });
    const filterCriteria = new TextDashboardFilterCriteria({
      filterLabel: textDashboardFilter.label,
      operator: 'Is Empty',
    });
    const endUserFilterCriteria = new TextDashboardFilterCriteria({
      filterLabel: textDashboardFilter.label,
      operator: 'Is Not Empty',
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Enable saving end user defaults', async () => {
      await dashboardPage.toggleEndUserDefaults();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Apply a dashboard default criteria to the dashboard', async () => {
      await dashboardPage.applyFilterCriteria(filterCriteria);
      await dashboardPage.saveFilterCriteriaAsDashboardDefault();
    });

    const testUserDashboardPage = new DashboardPage(testUserPage);

    await test.step('Apply an end user default criteria to the dashboard', async () => {
      await testUserDashboardPage.goto(dashboard.id);
      await testUserDashboardPage.applyFilterCriteria(endUserFilterCriteria);
      await testUserDashboardPage.saveFilterCriteriaAsEndUserDefault();
    });

    await test.step('Navigate to the content tab', async () => {
      await testUserDashboardPage.sidebar.contentTab.click();
    });

    await test.step('Navigate back to the dashboard', async () => {
      await testUserDashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the saved end user default criteria is applied', async () => {
      const filter = testUserDashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toHaveText(
        new RegExp(`${endUserFilterCriteria.filterLabel}\\s+${endUserFilterCriteria.operator}`)
      );
    });
  });

  test('Delete a dashboard filter', async ({ report, appAdminPage, sourceApp, dashboardPage, dashboard }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-757',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Verify dashboard filter was added', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toBeVisible();
    });

    await test.step('Delete the dashboard filter', async () => {
      await dashboardPage.deleteDashboardFilter(textDashboardFilter);
    });

    await test.step('Verify the dashboard filter was deleted', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toBeHidden();
    });
  });

  test('Reset dashboard filters to dashboard defaults', async ({
    report,
    appAdminPage,
    sourceApp,
    dashboardPage,
    dashboard,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-803',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const textDashboardFilter = new TextDashboardFilter({
      label: FakeDataFactory.createFakeDashboardFilterLabel(),
      fieldMappings: [{ dashboardObject: report.name, fields: [textField.name] }],
    });
    const filterCriteria = new TextDashboardFilterCriteria({
      filterLabel: textDashboardFilter.label,
      operator: 'Is Empty',
    });
    const differentCriteria = new TextDashboardFilterCriteria({
      filterLabel: textDashboardFilter.label,
      operator: 'Is Not Empty',
    });

    await test.step('Create the text field that will be mapped in the filter', async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Enable saving end user defaults', async () => {
      await dashboardPage.toggleEndUserDefaults();
    });

    await test.step('Add a dashboard filter', async () => {
      await dashboardPage.addDashboardFilter(textDashboardFilter);
    });

    await test.step('Apply criteria to filter and save as dashboard default', async () => {
      await dashboardPage.applyFilterCriteria(filterCriteria);
      await dashboardPage.saveFilterCriteriaAsDashboardDefault();
    });

    await test.step('Change the criteria applied to the filter and save as end user defaults', async () => {
      await dashboardPage.applyFilterCriteria(differentCriteria);
      await dashboardPage.saveFilterCriteriaAsEndUserDefault();
    });

    await test.step('Verify the criteria was changed', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toHaveText(new RegExp(`${differentCriteria.filterLabel}\\s+${differentCriteria.operator}`));
    });

    await test.step('Reset the criteria to the default', async () => {
      await dashboardPage.resetDashboardFilterCriteria();
    });

    await test.step('Verify the criteria was reset', async () => {
      const filter = dashboardPage.getDashboardFilterByLabel(textDashboardFilter.label);

      await expect(filter).toHaveText(new RegExp(`${filterCriteria.filterLabel}\\s+${filterCriteria.operator}`));
    });
  });
});
