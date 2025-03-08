import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect, Page } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createReportFixture } from '../../fixtures/report.fixtures';
import { createRoleFixture } from '../../fixtures/role.fixures';
import { activeUserWithRole } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { Container } from '../../models/container';
import { Dashboard, DashboardSchedule } from '../../models/dashboard';
import { ExportDashboardOptions } from '../../models/exportDashboardOptions';
import { SavedReport, SavedReportAsReportDataOnly } from '../../models/report';
import { AppPermission, Permission, Role } from '../../models/role';
import { User } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { LoginPage } from '../../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';

type DashboardTestFixtures = {
  adminHomePage: AdminHomePage;
  dashboardsAdminPage: DashboardsAdminPage;
  sourceApp: App;
  role: Role;
  user: User;
  testUserPage: Page;
  report: SavedReport;
  container: Container;
  dashboardPage: DashboardPage;
};

const test = base.extend<DashboardTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  dashboardsAdminPage: async ({ sysAdminPage }, use) => await use(new DashboardsAdminPage(sysAdminPage)),
  sourceApp: app,
  role: async ({ sysAdminPage, sourceApp }, use) =>
    await createRoleFixture(
      {
        sysAdminPage,
        roleStatus: 'Active',
        appPermissions: [
          new AppPermission({
            appName: sourceApp.name,
            contentRecords: new Permission({ read: true }),
          }),
        ],
      },
      use
    ),
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
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
  user: activeUserWithRole,
  testUserPage: testUserPage,
});

test.describe('dashboard', () => {
  let dashboardsToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ dashboardsAdminPage }) => {
    await dashboardsAdminPage.goto();
    await dashboardsAdminPage.deleteDashboards(dashboardsToDelete);
    dashboardsToDelete = [];
  });

  test('Create a Dashboard via the create button in the header of the admin home page', async ({ adminHomePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-316',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await adminHomePage.createDashboardUsingHeaderCreateButton(dashboardName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardName);
    });
  });

  test('Create a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-317',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await adminHomePage.createDashboardUsingDashboardsTileButton(dashboardName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardName);
    });
  });

  test('Create a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    dashboardsAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-318',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(dashboardsAdminPage.dashboardDesigner.title).toHaveText(dashboard.name);
    });
  });

  test('Create a copy of a Dashboard via the create button in the header of the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-319',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await adminHomePage.createDashboardUsingHeaderCreateButton(dashboardToCopyName);
      await adminHomePage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await adminHomePage.createDashboardCopyUsingHeaderCreateButton(dashboardToCopyName, dashboardCopyName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-320',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await adminHomePage.createDashboardUsingDashboardsTileButton(dashboardToCopyName);
      await adminHomePage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await adminHomePage.createDashboardCopyUsingDashboardsTileButton(dashboardToCopyName, dashboardCopyName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    dashboardsAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-321',
    });

    const dashboardToCopy = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    const dashboardCopyName = FakeDataFactory.createFakeAppName();
    dashboardsToDelete.push(dashboardToCopy.name, dashboardCopyName);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard to copy', async () => {
      await dashboardsAdminPage.createDashboard(dashboardToCopy);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await dashboardsAdminPage.createDashboardCopy(dashboardToCopy.name, dashboardCopyName);
      await dashboardsAdminPage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(dashboardsAdminPage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Update a dashboard', async ({ dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-322',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Update the dashboard', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      const updatedDashboard = await dashboardsAdminPage.getDashboardRow(dashboard.name);
      await expect(updatedDashboard).toBeVisible();
    });
  });

  test('Delete a dashboard', async ({ dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-323',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Delete the dashboard', async () => {
      await dashboardsAdminPage.deleteDashboards([dashboard.name]);
    });

    await test.step('Verify the dashboard was deleted', async () => {
      const dashboardRow = await dashboardsAdminPage.getDashboardRow(dashboard.name);
      await expect(dashboardRow).not.toBeAttached();
    });
  });

  test("Edit a dashboard's configurations from the dashboard", async ({
    report,
    container,
    dashboardsAdminPage,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-324',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardPage.openDashboardDesigner();
    });

    await test.step('Update the dashboard', async () => {
      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await dashboardPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardPage.dashboardDesigner.saveAndClose();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      await dashboardPage.goto(dashboard.id);
      await expect(dashboardPage.dashboardBreadcrumbTitle).toHaveText(dashboard.name);
    });
  });

  test('Print a dashboard', async ({
    report,
    container,
    dashboardsAdminPage,
    dashboardPage,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-325',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    let pdfPath: string;

    await test.step('Print the dashboard', async () => {
      await dashboardPage.printDashboard();

      const pdfResponse = await dashboardPage.page.request.post(`/Dashboard/${dashboard.id}/Print`, {
        form: { Orientation: 1 },
      });
      const responseHeaders = pdfResponse.headers();
      const nameMatch = responseHeaders['content-disposition'].match(/filename="(.+?)"/);

      expect(nameMatch).not.toBeNull();

      const pdfName = nameMatch![1];

      expect(pdfName).toBe(`${dashboard.name}.pdf`);

      const pdf = await pdfResponse.body();

      pdfPath = await downloadService.saveBuffer(pdf, pdfName);
    });

    await test.step('Verify the printed dashboard contains expected text', async () => {
      const expectedText = [dashboard.name, report.name];
      const foundExpectedText = await pdfParser.findTextInPDF(pdfPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test('Export a dashboard', async ({
    report,
    container,
    dashboardsAdminPage,
    dashboardPage,
    sysAdminUser,
    sysAdminEmail,
    sysAdminPage,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-326',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Export the dashboard', async () => {
      await dashboardPage.exportDashboard();
    });

    let exportEmailContent: string;

    await test.step('Verify the dashboard has been exported', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', sysAdminUser.email],
          ['SUBJECT', 'Onspring Dashboard Export Complete'],
          ['TEXT', dashboard.name],
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

    let dashboardPath: string;

    await test.step('Download the exported dashboard', async () => {
      await sysAdminPage.setContent(exportEmailContent);

      const dashboardDownloadPromise = sysAdminPage.waitForEvent('download');
      await sysAdminPage.getByRole('link').click();
      const download = await dashboardDownloadPromise;
      dashboardPath = await downloadService.saveDownload(download);
    });

    await test.step('Verify the exported dashboard contains expected data', async () => {
      const expectedText = [dashboard.name, report.name];
      const foundExpectedText = await pdfParser.findTextInPDF(dashboardPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test('Schedule a dashboard for export', async ({
    report,
    container,
    dashboardsAdminPage,
    sysAdminUser,
    sysAdminEmail,
    sysAdminPage,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-327',
    });

    test.slow();

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    const emailSubject = `Scheduled Dashboard ${dashboardName}`;

    const dashboard = new Dashboard({
      name: dashboardName,
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
      schedule: new DashboardSchedule({
        sendFrequency: 'Every Day',
        startingOn: new Date(Date.now() + 120_000),
        fromName: 'Automation Test',
        fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
        subject: emailSubject,
        body: 'This is the body of the scheduled dashboard.',
        exportDashboardOptions: new ExportDashboardOptions({
          orientation: 'Landscape',
        }),
        specificUsers: [sysAdminUser.fullName],
      }),
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    let exportEmailContent: string;

    await test.step('Verify the dashboard has been exported', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', sysAdminUser.email],
          ['SUBJECT', emailSubject],
          ['TEXT', dashboard.name],
          ['UNSEEN'],
        ];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [150_000, 30_000],
        timeout: 600_000,
      });
    });

    let dashboardPath: string;

    await test.step('Download the exported dashboard', async () => {
      await sysAdminPage.setContent(exportEmailContent);

      const dashboardDownloadPromise = sysAdminPage.waitForEvent('download');
      await sysAdminPage.getByRole('link').click();
      const download = await dashboardDownloadPromise;
      dashboardPath = await downloadService.saveDownload(download);
    });

    await test.step('Verify the exported dashboard contains expected data', async () => {
      const expectedText = [dashboard.name, report.name];
      const foundExpectedText = await pdfParser.findTextInPDF(dashboardPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test("Get a dashboard's link", async ({ report, container, dashboardsAdminPage, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-328',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    let dashboardLink: string;

    await test.step("Get the dashboard's link", async () => {
      dashboardLink = await dashboardPage.getDashboardLink();
    });

    await test.step('Verify the dashboard link has expected value', async () => {
      expect(dashboardLink).toMatch(new RegExp(`/Dashboard/${dashboard.id}`));
    });
  });

  test('Set a dashboard as your default dashboard', async ({
    report,
    container,
    dashboardsAdminPage,
    testUserPage,
    user,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-329',
    });

    const dashboards = [
      new Dashboard({
        name: FakeDataFactory.createFakeDashboardName(),
        containers: [container.name],
        items: [
          {
            object: report,
            row: 0,
            column: 0,
          },
        ],
      }),
      new Dashboard({
        name: FakeDataFactory.createFakeDashboardName(),
        containers: [container.name],
        items: [
          {
            object: report,
            row: 0,
            column: 0,
          },
        ],
      }),
    ];

    dashboardsToDelete.push(...dashboards.map(d => d.name));

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboards', async () => {
      for (const dashboard of dashboards) {
        await dashboardsAdminPage.createDashboard(dashboard);
        await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
        await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      }
    });

    await test.step('Set default dashboard and logout', async () => {
      const dashboardPage = new DashboardPage(testUserPage);
      await dashboardPage.goto();
      await dashboardPage.setDefaultDashboard(dashboards[1].name);
      await dashboardPage.logout();
    });

    await test.step('Log in as user and verify default dashboard', async () => {
      const loginPage = new LoginPage(testUserPage);
      const dashboardPage = new DashboardPage(testUserPage);

      await loginPage.login(user);
      await loginPage.page.waitForURL(dashboardPage.path);

      await expect(dashboardPage.dashboardBreadcrumbTitle).toHaveText(dashboards[1].name);
    });
  });

  test('Disable a dashboard', async ({ report, container, dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-330',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardsAdminPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is enabled', async () => {
      await dashboardsAdminPage.page.reload();
      await dashboardsAdminPage.sidebar.dashboardsTab.click();

      const containerLink = dashboardsAdminPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeVisible();
      await dashboardsAdminPage.sidebar.dashboardsTab.click();
    });

    await test.step('Disable the dashboard', async () => {
      dashboard.status = false;
      
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardsAdminPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is disabled', async () => {
      await dashboardsAdminPage.page.reload();
      await dashboardsAdminPage.sidebar.dashboardsTab.click();

      const containerLink = dashboardsAdminPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeHidden();
    });
  });

  test('Enable a dashboard', async ({ report, container, dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-331',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      status: false,
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardsAdminPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is disabled', async () => {
      await dashboardsAdminPage.page.reload();
      await dashboardsAdminPage.sidebar.dashboardsTab.click();

      const containerLink = dashboardsAdminPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeHidden();
    });

    await test.step('Enable the dashboard', async () => {
      dashboard.status = true;
      
      await dashboardsAdminPage.goto();
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardsAdminPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is enabled', async () => {
      await dashboardsAdminPage.page.reload();
      await dashboardsAdminPage.sidebar.dashboardsTab.click();

      const containerLink = dashboardsAdminPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeVisible();
    });
  });

  test('Make a dashboard private', async ({ report, container, dashboardsAdminPage, testUserPage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-332',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    const testUserDashboardPage = new DashboardPage(testUserPage);

    await test.step('Verify the dashboard is visible', async () => {
      await testUserDashboardPage.goto();
      await testUserDashboardPage.sidebar.dashboardsTab.click();

      const containerLink = testUserDashboardPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeVisible();
      await testUserDashboardPage.sidebar.dashboardsTab.click();
    });

    await test.step('Make the dashboard private', async () => {
      dashboard.permissionStatus = 'Private';
      dashboard.permissions.users.push(sysAdminUser.fullName);

      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the dashboard is not visible', async () => {
      await testUserDashboardPage.page.reload();
      await testUserDashboardPage.sidebar.dashboardsTab.click();

      const containerLink = testUserDashboardPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeHidden();
    });
  });

  test('Make a dashboard public', async ({ report, container, dashboardsAdminPage, testUserPage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-333',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      permissionStatus: 'Private',
      permissions: {
        users: [sysAdminUser.fullName],
      },
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    const testUserDashboardPage = new DashboardPage(testUserPage);

    await test.step('Verify the dashboard is not visible', async () => {
      await testUserDashboardPage.goto();
      await testUserDashboardPage.sidebar.dashboardsTab.click();

      const containerLink = testUserDashboardPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeHidden();
      await testUserDashboardPage.sidebar.dashboardsTab.click();
    });

    await test.step('Make the dashboard public', async () => {
      dashboard.permissionStatus = 'Public';

      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the dashboard is visible', async () => {
      await testUserDashboardPage.page.reload();
      await testUserDashboardPage.sidebar.dashboardsTab.click();

      const containerLink = testUserDashboardPage.sidebar.getContainerLink(container.name);
      await expect(containerLink).toBeVisible();
    });
  });

  test("Navigate to a dashboard via it's link", async ({ report, container, dashboardsAdminPage, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-334',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    let dashboardLink: string;

    await test.step("Get the dashboard's link", async () => {
      dashboardLink = await dashboardPage.getDashboardLink();
    });

    await test.step('Navigate to another page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Navigate back to the dashboard via the link', async () => {
      await dashboardPage.page.goto(dashboardLink);
    });

    await test.step('Verify the dashboard has expected title', async () => {
      await expect(dashboardPage.dashboardBreadcrumbTitle).toHaveText(dashboard.name);
    });
  });

  test('Add a dashboard title to a dashboard', async ({ report, container, dashboardsAdminPage, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-869',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      displayTitle: false,
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the dashboard has no title', async () => {
      await dashboardPage.goto(dashboard.id);
      await expect(dashboardPage.dashboardTitle).toBeHidden();
    });

    await test.step('Add a title to the dashboard', async () => {
      dashboard.displayTitle = true;

      await dashboardPage.openDashboardDesigner();
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await dashboardPage.page.waitForTimeout(1000);
    });

    await test.step('Verify the dashboard has the expected title', async () => {
      await dashboardPage.goto(dashboard.id);
      await expect(dashboardPage.dashboardTitle).toHaveText(dashboard.name);
    });
  });
});
