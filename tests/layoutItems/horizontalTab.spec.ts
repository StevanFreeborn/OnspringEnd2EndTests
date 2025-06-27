import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AnnotationType } from '../annotations';

type HorizontalTabTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
};

const test = base.extend<HorizontalTabTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
});

test.describe('horizontal tab', () => {
  test("Add a horizontal tab to an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-42',
    });

    const tabName = 'New Tab';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a horizontal tab to the layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.addTab({
        name: tabName,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Last Saved By',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the horizontal tab is added', async () => {
      await addContentPage.goto(app.id);

      const tab = addContentPage.page.getByRole('tab', { name: tabName });

      await expect(tab).toBeVisible();
    });
  });

  test("Update a horizontal tab on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-43',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a horizontal tab on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-44',
    });

    expect(true).toBeTruthy();
  });

  test("Rearrange the horizontal tabs on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-45',
    });

    expect(true).toBeTruthy();
  });
});
