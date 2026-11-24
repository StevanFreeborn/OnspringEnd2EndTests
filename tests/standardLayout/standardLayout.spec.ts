import { App, AppPermission, Permission, Role } from '@stevanfreeborn/onspring-models';
import { AppLayoutTabTargets, AppTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base, RoleFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type StandardLayoutTestFixtures = {
  app: App;
  role: Role;
};

const test = base.extend<StandardLayoutTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app!.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .build(),
});

test.describe('standard layout', () => {
  test('Add a standard layout to an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-32',
    });

    const layoutName = 'Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        AppTasks.addLayout(layoutName),
        AppTasks.closeLayout()
      );
    });

    await test.step('Verify the standard layout is added', async () => {
      await sysAdminActor.browse().check(AppLayoutTabTargets.layoutRowByName(layoutName)).isVisible();
    });
  });

  test('Update a standard layout of an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-33',
    });

    const layoutName = 'Standard Layout';
    const updatedLayoutName = 'Updated Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), AppTasks.addLayout(layoutName));
    });

    await test.step('Update a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.updateLayoutProperties({ name: updatedLayoutName }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standard layout is updated', async () => {
      await sysAdminActor.browse().check(AppLayoutTabTargets.layoutRowByName(updatedLayoutName)).isVisible();
    });
  });

  test('Disable a standard layout of an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-35',
    });

    const layoutName = 'Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), AppTasks.addLayout(layoutName));
    });

    await test.step('Disable a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.updateLayoutProperties({ enabled: false }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standard layout is disabled', async () => {
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.layoutRowByName(layoutName))
        .hasText(/Disabled/);
    });
  });

  test('Enable a standard layout of an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-36',
    });

    const layoutName = 'Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), AppTasks.addLayout(layoutName));
    });

    await test.step('Disable a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.updateLayoutProperties({ enabled: false }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Enable a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(layoutName),
        AppTasks.updateLayoutProperties({ enabled: true }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standard layout is enabled', async () => {
      const layoutRow = AppLayoutTabTargets.layoutRowByName(layoutName);
      await sysAdminActor
        .browse()
        .check(layoutRow)
        .doesNotHaveText(/Disabled/);
      await sysAdminActor
        .browse()
        .check(layoutRow)
        .hasText(/Enabled/);
    });
  });

  test('Delete a standard layout of an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-37',
    });

    const layoutName = 'Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        AppTasks.addLayout(layoutName),
        AppTasks.closeLayout()
      );
    });

    await test.step('Delete a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.deleteLayout(layoutName));
    });

    await test.step('Verify the standard layout is deleted', async () => {
      await sysAdminActor.browse().check(AppLayoutTabTargets.layoutRowByName(layoutName)).isHidden();
    });
  });

  test('Assign roles to a standard layout of an app', async ({ app, role, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-55',
    });

    const layoutName = 'Standard Layout';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), AppTasks.addLayout(layoutName));
    });

    await test.step('Assign roles to a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.updateLayoutProperties({ roleNames: [role.name] }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the roles are assigned to the standard layout', async () => {
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.layoutRowByName(layoutName))
        .hasText(new RegExp(role.name, 'i'));
    });
  });

  test('Make a copy of a standard layout', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-864',
    });

    const layoutName = 'Standard Layout';
    const copiedLayoutName = 'Standard Layout Copy';

    await test.step('Add a standard layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        AppTasks.addLayout(layoutName),
        AppTasks.closeLayout()
      );
    });

    await test.step('Make a copy of a standard layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.copyLayout(layoutName, copiedLayoutName), AppTasks.closeLayout());
    });

    await test.step('Verify the copy of the standard layout is created', async () => {
      await sysAdminActor.browse().check(AppLayoutTabTargets.layoutRowByName(copiedLayoutName)).isVisible();
    });
  });
});
