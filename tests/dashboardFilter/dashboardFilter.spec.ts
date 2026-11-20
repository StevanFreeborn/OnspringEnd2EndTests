import {
  App,
  Container,
  Dashboard,
  FakeDataFactory,
  SavedReport,
  TextDashboardFilter,
  TextDashboardFilterCriteria,
  TextField,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  DashboardFilterTargets,
  DashboardFilterTasks,
  DashboardTasks,
  SidebarNavTargets,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  ActorFixture,
  AppFixture,
  ContainerFixture,
  DashboardFixture,
  ReportFixture,
  UserFixture,
  test as base,
} from '../../fixtures';
import { AnnotationType } from '../annotations';

type DashboardFilterTestFixtures = {
  app: App;
  user: User;
  testUserActor: WebActor;
  report: SavedReport;
  container: Container;
  dashboard: Dashboard;
};

const test = base.extend<DashboardFilterTestFixtures>({
  app: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
  report: ReportFixture.create().withSecurity('Public').build(),
  container: ContainerFixture.create().build(),
  dashboard: DashboardFixture.create()
    .withContainers(({ container }) => [container.name])
    .withItems(({ report }) => [{ item: report, row: 0, column: 0 }])
    .build(),
});

test.describe('dashboard filter', () => {
  test('Enable dashboard filters', async ({ dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-751',
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Verify filter bar is present', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterBar).isVisible();
    });
  });

  test('Add a dashboard filter', async ({ dashboard, report, app, sysAdminActor, testUserActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Add a dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Verify dashboard filter was added', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label)).isVisible();
    });
  });

  test('Update a dashboard filter', async ({ app, dashboard, report, sysAdminActor, testUserActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Add a dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Verify dashboard filter was added', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label)).isVisible();
    });

    const existingLabel = textDashboardFilter.label;
    textDashboardFilter.label = FakeDataFactory.createFakeDashboardFilterLabel();

    await test.step('Edit the dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.editFilter(existingLabel, textDashboardFilter));
    });

    await test.step('Verify the dashboard filter was edited', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label)).isVisible();
    });
  });

  test('Move a dashboard filter', async ({ report, app, dashboard, sysAdminActor, testUserActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Add dashboard filters', async () => {
      await testUserActor.attemptsTo(
        DashboardFilterTasks.addFilter(firstDashboardFilter),
        DashboardFilterTasks.addFilter(secondDashboardFilter)
      );
    });

    await test.step('Verify dashboard filters were added', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(firstDashboardFilter.label))
        .isLeftOf(DashboardFilterTargets.filterByLabel(secondDashboardFilter.label));
    });

    await test.step('Move dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.moveFilterRight(firstDashboardFilter.label));
    });

    await test.step('Verify the dashboard filter was moved', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(firstDashboardFilter.label))
        .isRightOf(DashboardFilterTargets.filterByLabel(secondDashboardFilter.label));
    });
  });

  test('Save default dashboard filter criteria for a dashboard', async ({
    report,
    app,
    dashboard,
    sysAdminActor,
    testUserActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Add a dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Apply criteria to filter and save as dashboard default', async () => {
      await testUserActor.attemptsTo(
        DashboardFilterTasks.applyFilterCriteria(filterCriteria),
        DashboardFilterTasks.saveFilterCriteriaAsDefault()
      );
    });

    await test.step('Navigate to the content tab', async () => {
      await testUserActor.browse().click(SidebarNavTargets.contentTab);
    });

    await test.step('Navigate back to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the saved default criteria is applied', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label))
        .hasText(new RegExp(`${filterCriteria.filterLabel}\\s+${filterCriteria.operator}`));
    });
  });

  test('Save end user default dashboard filter criteria for a dashboard', async ({
    report,
    app,
    dashboard,
    sysAdminActor,
    testUserActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await sysAdminActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Enable saving end user defaults', async () => {
      await sysAdminActor.attemptsTo(DashboardFilterTasks.toggleEndUserDefaults());
    });

    await test.step('Add a dashboard filter', async () => {
      await sysAdminActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Apply a dashboard default criteria to the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardFilterTasks.applyFilterCriteria(filterCriteria),
        DashboardFilterTasks.saveFilterCriteriaAsDashboardDefault()
      );
    });

    await test.step('Apply an end user default criteria to the dashboard', async () => {
      await testUserActor.attemptsTo(
        DashboardTasks.gotoDashboard(dashboard.id),
        DashboardFilterTasks.applyFilterCriteria(endUserFilterCriteria),
        DashboardFilterTasks.saveFilterCriteriaAsEndUserDefault()
      );
    });

    await test.step('Navigate to the content tab', async () => {
      await testUserActor.browse().click(SidebarNavTargets.contentTab);
    });

    await test.step('Navigate back to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the saved end user default criteria is applied', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label))
        .hasText(new RegExp(`${endUserFilterCriteria.filterLabel}\\s+${endUserFilterCriteria.operator}`));
    });
  });

  test('Delete a dashboard filter', async ({ report, app, dashboard, sysAdminActor, testUserActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Add a dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Verify dashboard filter was added', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label)).isVisible();
    });

    await test.step('Delete the dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.deleteFilter(textDashboardFilter.label));
    });

    await test.step('Verify the dashboard filter was deleted', async () => {
      await testUserActor.browse().check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label)).isHidden();
    });
  });

  test('Reset dashboard filters to dashboard defaults', async ({
    report,
    app,
    dashboard,
    sysAdminActor,
    testUserActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the dashboard', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Enable dashboard filters', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleDashboardFilters());
    });

    await test.step('Enable saving end user defaults', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.toggleEndUserDefaults());
    });

    await test.step('Add a dashboard filter', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.addFilter(textDashboardFilter));
    });

    await test.step('Apply criteria to filter and save as dashboard default', async () => {
      await testUserActor.attemptsTo(
        DashboardFilterTasks.applyFilterCriteria(filterCriteria),
        DashboardFilterTasks.saveFilterCriteriaAsDashboardDefault()
      );
    });

    await test.step('Change the criteria applied to the filter and save as end user defaults', async () => {
      await testUserActor.attemptsTo(
        DashboardFilterTasks.applyFilterCriteria(differentCriteria),
        DashboardFilterTasks.saveFilterCriteriaAsEndUserDefault()
      );
    });

    await test.step('Verify the criteria was changed', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label))
        .hasText(new RegExp(`${differentCriteria.filterLabel}\\s+${differentCriteria.operator}`));
    });

    await test.step('Reset the criteria to the default', async () => {
      await testUserActor.attemptsTo(DashboardFilterTasks.resetFilterCriteria());
    });

    await test.step('Verify the criteria was reset', async () => {
      await testUserActor
        .browse()
        .check(DashboardFilterTargets.filterByLabel(textDashboardFilter.label))
        .hasText(new RegExp(`${filterCriteria.filterLabel}\\s+${filterCriteria.operator}`));
    });
  });
});
