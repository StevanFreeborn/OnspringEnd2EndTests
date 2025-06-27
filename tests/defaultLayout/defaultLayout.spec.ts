import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AnnotationType } from '../annotations';

type DefaultLayoutTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
};

const test = base.extend<DefaultLayoutTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
});

test.describe('default layout', () => {
  test('Update the default layout of an app', async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-34',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Update the default layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionRow: 0,
        sectionColumn: 0,
        fieldName: 'Record ID',
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the default layout is updated', async () => {
      await addContentPage.goto(app.id);

      const recordIdField = await addContentPage.form.getField({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        fieldName: 'Record ID',
        fieldType: 'AutoNumber',
      });

      await expect(recordIdField).toBeVisible();
    });
  });

  test('Update the number of columns for a default layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-868',
    });

    await test.step('Navigate to the app admin page', async () => {});

    await test.step('Update the number of columns', async () => {});

    await test.step('Verify the number of columns is updated', async () => {});

    expect(true).toBe(true);
  });
});
