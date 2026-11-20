import {
  App,
  AppPermission,
  Container,
  Dashboard,
  DashboardSchedule,
  ExportDashboardOptions,
  FakeDataFactory,
  Permission,
  Role,
  SavedReport,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AuthTasks,
  DashboardDesignerTargets,
  DashboardPageTargets,
  DashboardQuestions,
  DashboardTasks,
  DashboardTargets,
  DashboardsAdminPageTargets,
  SidebarNavTargets,
  SidebarNavTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  ActorFixture,
  AppFixture,
  ContainerFixture,
  ReportFixture,
  RoleFixture,
  UserFixture,
  test as base,
  expect,
} from '../../fixtures';
import { AnnotationType } from '../annotations';

type DashboardTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
  report: SavedReport;
  container: Container;
};

const test = base.extend<DashboardTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withStatus('Active')
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app!.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .build(),
  report: ReportFixture.create().withSecurity('Public').build(),
  container: ContainerFixture.create().build(),
  user: UserFixture.create()
    .withStatus('Active')
    .withRoles(({ role }) => [role.name])
    .build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('dashboard', () => {
  let dashboardsToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DashboardTasks.deleteDashboards(dashboardsToDelete));
    dashboardsToDelete = [];
  });

  test('Create a Dashboard via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-316',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createViaHeader(dashboardName));
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboardName);
    });
  });

  test('Create a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-317',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createViaTile(dashboardName));
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboardName);
    });
  });

  test('Create a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-318',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboard.name);
    });
  });

  test('Create a copy of a Dashboard via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-319',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createViaHeader(dashboardToCopyName),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Create the copy of the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createCopyViaHeader(dashboardToCopyName, dashboardCopyName));
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-320',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createViaTile(dashboardToCopyName), DashboardTasks.closeDesigner());
    });

    await test.step('Create the copy of the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createCopyViaTile(dashboardToCopyName, dashboardCopyName));
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-321',
    });

    const dashboardToCopy = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopy.name, dashboardCopyName);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard to copy', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboardToCopy.name),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Create the copy of the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createCopyFromAdminPage(dashboardToCopy.name, dashboardCopyName));
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await sysAdminActor.browse().check(DashboardDesignerTargets.title).hasText(dashboardCopyName);
    });
  });

  test('Update a dashboard', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-322',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Update the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));

      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.scrollAllIntoView());
      await sysAdminActor.browse().check(DashboardsAdminPageTargets.rowByName(dashboard.name)).isVisible();
    });
  });

  test('Delete a dashboard', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-323',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Delete the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.deleteDashboard(dashboard.name));
    });

    await test.step('Verify the dashboard was deleted', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.scrollAllIntoView());
      await sysAdminActor.browse().check(DashboardsAdminPageTargets.rowByName(dashboard.name)).isNotAttached();
    });
  });

  test("Edit a dashboard's configurations from the dashboard", async ({ report, container, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-324',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromDashboard());
    });

    await test.step('Update the dashboard', async () => {
      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
      await sysAdminActor.browse().waitForTimeout(1000);
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.breadcrumbTitle).hasText(dashboard.name);
    });
  });

  test('Print a dashboard', async ({ report, container, sysAdminActor, downloadService, pdfParser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-325',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    let pdfPath: string;

    await test.step('Print the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.printDashboard());

      const { fileName, body } = await sysAdminActor.asks(DashboardQuestions.printedPdf(dashboard.id));
      expect(fileName).toBe(`${dashboard.name}.pdf`);

      pdfPath = await downloadService.saveBuffer(Buffer.from(body), fileName);
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
    sysAdminActor,
    sysAdminUser,
    sysAdminEmail,
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
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Export the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.exportDashboard());
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
      const download = await sysAdminActor.asks(DashboardQuestions.downloadedExportFromEmailHtml(exportEmailContent));
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
    sysAdminActor,
    sysAdminUser,
    sysAdminEmail,
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
          item: report,
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
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
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
      const download = await sysAdminActor.asks(DashboardQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      dashboardPath = await downloadService.saveDownload(download);
    });

    await test.step('Verify the exported dashboard contains expected data', async () => {
      const expectedText = [dashboard.name, report.name];
      const foundExpectedText = await pdfParser.findTextInPDF(dashboardPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test("Get a dashboard's link", async ({ report, container, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-328',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    let dashboardLink: string;

    await test.step("Get the dashboard's link", async () => {
      dashboardLink = await sysAdminActor.asks(DashboardQuestions.dashboardLink());
    });

    await test.step('Verify the dashboard link has expected value', async () => {
      expect(dashboardLink).toMatch(new RegExp(`/Dashboard/${dashboard.id}`));
    });
  });

  test('Set a dashboard as your default dashboard', async ({
    report,
    container,
    sysAdminActor,
    testUserActor,
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
            item: report,
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
            item: report,
            row: 0,
            column: 0,
          },
        ],
      }),
    ];

    dashboardsToDelete.push(...dashboards.map(d => d.name));

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboards', async () => {
      for (const dashboard of dashboards) {
        await sysAdminActor.attemptsTo(
          DashboardTasks.createFromAdminPage(dashboard.name),
          DashboardTasks.updateInDesigner(dashboard),
          DashboardTasks.saveAndCloseDesigner()
        );
      }
    });

    await test.step('Set default dashboard and logout', async () => {
      await testUserActor.attemptsTo(
        DashboardTasks.gotoDashboard(),
        SidebarNavTasks.setDefaultDashboard(dashboards[1].name),
        SidebarNavTasks.logout()
      );
    });

    await test.step('Log in as user and verify default dashboard', async () => {
      await testUserActor.attemptsTo(AuthTasks.login(user.username, user.password));
      await testUserActor.browse().waitForUrl(DashboardTargets.pathRegex);
      await testUserActor.browse().check(DashboardPageTargets.breadcrumbTitle).hasText(dashboards[1].name);
    });
  });

  test('Disable a dashboard', async ({ report, container, sysAdminActor, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-330',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      status: false,
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
      await sysAdminActor.browse().waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is disabled', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard());
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
      await testUserActor.browse().waitForUrl(DashboardPageTargets.route);
      await testUserActor.browse().check(SidebarNavTargets.containerLink(container.name)).isHidden();
    });
  });

  test('Enable a dashboard', async ({ report, container, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-331',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      status: true,
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
      await sysAdminActor.browse().waitForTimeout(1000);
    });

    await test.step('Verify the dashboard is enabled', async () => {
      await sysAdminActor.browse().click(SidebarNavTargets.dashboardsTab);
      await sysAdminActor.browse().check(SidebarNavTargets.containerLink(container.name)).isVisible();
    });
  });

  test('Make a dashboard private', async ({ report, container, sysAdminActor, testUserActor, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-332',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the dashboard is visible', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard());
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
      await testUserActor.browse().check(SidebarNavTargets.containerLink(container.name)).isVisible();
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
    });

    await test.step('Make the dashboard private', async () => {
      dashboard.permissionStatus = 'Private';
      dashboard.permissions.users.push(sysAdminUser.fullName);

      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the dashboard is not visible', async () => {
      await testUserActor.browse().reload();
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
      await testUserActor.browse().check(SidebarNavTargets.containerLink(container.name)).isHidden();
    });
  });

  test('Make a dashboard public', async ({ report, container, sysAdminActor, testUserActor, sysAdminUser }) => {
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
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.createFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the dashboard is not visible', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard());
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
      await testUserActor.browse().check(SidebarNavTargets.containerLink(container.name)).isHidden();
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
    });

    await test.step('Make the dashboard public', async () => {
      dashboard.permissionStatus = 'Public';

      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the dashboard is visible', async () => {
      await testUserActor.browse().reload();
      await testUserActor.browse().click(SidebarNavTargets.dashboardsTab);
      await testUserActor.browse().check(SidebarNavTargets.containerLink(container.name)).isVisible();
    });
  });

  test("Navigate to a dashboard via it's link", async ({ report, container, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-334',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    let dashboardLink: string;

    await test.step("Get the dashboard's link", async () => {
      dashboardLink = await sysAdminActor.asks(DashboardQuestions.dashboardLink());
    });

    await test.step('Navigate to another page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Navigate back to the dashboard via the link', async () => {
      await sysAdminActor.browse().goto(dashboardLink);
    });

    await test.step('Verify the dashboard has expected title', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.breadcrumbTitle).hasText(dashboard.name);
    });
  });

  test('Add a dashboard title to a dashboard', async ({ report, container, sysAdminActor }) => {
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
          item: report,
          row: 0,
          column: 0,
        },
      ],
    });

    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.createFromAdminPage(dashboard.name));
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Verify the dashboard has no title', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardTitle).isHidden();
    });

    await test.step('Add a title to the dashboard', async () => {
      dashboard.displayTitle = true;

      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardTasks.updateInDesigner(dashboard),
        DashboardTasks.saveAndCloseDesigner()
      );
      await sysAdminActor.browse().waitForTimeout(1000);
    });

    await test.step('Verify the dashboard has the expected title', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().waitForTimeout(1000);
      await sysAdminActor.browse().reload();
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardTitle).hasText(dashboard.name);
    });
  });
});
