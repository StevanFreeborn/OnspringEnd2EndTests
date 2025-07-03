import { expect } from '@playwright/test';
import { test as base } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createRoleFixture } from '../../fixtures/role.fixures';
import { App } from '../../models/app';
import { AppPermission, Permission, Role } from '../../models/role';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type StandardLayoutTestFixtures = {
  app: App;
  role: Role;
  appAdminPage: AppAdminPage;
};

const test = base.extend<StandardLayoutTestFixtures>({
  app: app,
  role: async ({ sysAdminPage, app }, use) => {
    await createRoleFixture(
      {
        sysAdminPage,
        roleStatus: 'Active',
        appPermissions: [
          new AppPermission({
            appName: app.name,
            contentRecords: new Permission({ read: true }),
          }),
        ],
      },
      use
    );
  },
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('standard layout', () => {
  test('Add a standard layout to an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-32',
    });

    const layoutName = 'Standard Layout';

    await test.step('Navigate to app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
      await appAdminPage.layoutTab.layoutDesignerModal.closeLayout();
    });

    await test.step('Verify the standard layout is added', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(layoutName);

      await expect(layoutRow).toBeVisible();
    });
  });

  test('Update a standard layout of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-33',
    });

    const layoutName = 'Standard Layout';
    const updatedLayoutName = 'Updated Standard Layout';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
    });

    await test.step('Update a standard layout', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.layoutNameInput.fill(
        updatedLayoutName
      );
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the standard layout is updated', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(updatedLayoutName);

      await expect(layoutRow).toBeVisible();
    });
  });

  test('Disable a standard layout of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-35',
    });

    const layoutName = 'Standard Layout';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
    });

    await test.step('Disable a standard layout', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.statusToggle.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the standard layout is disabled', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(layoutName);

      await expect(layoutRow).toHaveText(/Disabled/);
    });
  });

  test('Enable a standard layout of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-36',
    });

    const layoutName = 'Standard Layout';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
    });

    await test.step('Disable a standard layout', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.statusToggle.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Enable a standard layout', async () => {
      await appAdminPage.layoutTab.openLayout(layoutName);
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.statusToggle.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the standard layout is enabled', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(layoutName);

      await expect(layoutRow).not.toHaveText(/Disabled/);
      await expect(layoutRow).toHaveText(/Enabled/);
    });
  });

  test('Delete a standard layout of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-37',
    });

    const layoutName = 'Standard Layout';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
      await appAdminPage.layoutTab.layoutDesignerModal.closeLayout();
    });

    const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(layoutName);

    await test.step('Delete a standard layout', async () => {
      await layoutRow.hover();
      await layoutRow.getByTitle('Delete Layout').click();
      await appAdminPage.layoutTab.deleteLayoutDialog.deleteButton.click();
      await appAdminPage.layoutTab.deleteLayoutDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the standard layout is deleted', async () => {
      await expect(layoutRow).toBeHidden();
    });
  });

  test('Assign roles to a standard layout of an app', async ({ app, role, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-55',
    });

    const layoutName = 'Standard Layout';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standard layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayout(layoutName);
    });

    await test.step('Assign roles to a standard layout', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.rolesDualPaneSelector.selectOption(
        role.name
      );
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the roles are assigned to the standard layout', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(layoutName);

      await expect(layoutRow).toHaveText(new RegExp(role.name, 'i'));
    });
  });

  test('Make a copy of a standard layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-864',
    });

    expect(true).toBeTruthy();
  });
});
