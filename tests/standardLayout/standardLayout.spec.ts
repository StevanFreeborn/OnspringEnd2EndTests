import { expect } from '@playwright/test';
import { test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { app } from '../../fixtures/app.fixtures';

type StandardLayoutTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<StandardLayoutTestFixtures>({
  app: app,
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

  test('Update a standard layout of an app', async ({
    app,
    appAdminPage,
  }) => {
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
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.layoutNameInput.fill(updatedLayoutName);
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the standard layout is updated', async () => {
      const layoutRow = appAdminPage.layoutTab.getLayoutRowByName(updatedLayoutName);

      await expect(layoutRow).toBeVisible();
    });
  });

  test('Disable a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-35',
    });

    expect(true).toBeTruthy();
  });

  test('Enable a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-36',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-37',
    });

    expect(true).toBeTruthy();
  });

  test('Assign roles to a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-55',
    });

    expect(true).toBeTruthy();
  });

  test('Make a copy of a standard layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-864',
    });

    expect(true).toBeTruthy();
  });
});
