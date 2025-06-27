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

  test("Update a horizontal tab on an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-43',
    });

    const tabName = 'Updated Tab Name';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Update a horizontal tab on the layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Last Saved By',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.updateTabName({
        currentName: 'Tab 2',
        newName: tabName,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the horizontal tab is updated', async () => {
      await addContentPage.goto(app.id);

      const tab = addContentPage.page.getByRole('tab', { name: tabName });

      await expect(tab).toBeVisible();
    });
  });

  test("Delete a horizontal tab on an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-44',
    });

    const tabName = 'Tab 2';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Delete a horizontal tab on the layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.configureTabSetLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.configureTabSetModal.deleteTab(tabName);
      await appAdminPage.layoutTab.layoutDesignerModal.configureTabSetModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the horizontal tab is deleted', async () => {
      await addContentPage.goto(app.id);

      const tab = addContentPage.page.getByRole('tab', { name: tabName });

      await expect(tab).toBeHidden();
    });
  });

  test("Rearrange the horizontal tabs on an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-45',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Rearrange the horizontal tabs on the layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Last Saved By',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.dragTab({
        tabName: 'Tab 2',
        index: 0,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the horizontal tabs are rearranged', async () => {
      await addContentPage.goto(app.id);

      const firstTab = addContentPage.page.getByRole('tab', { name: 'Tab 2' });
      const secondTab = addContentPage.page.getByRole('tab', { name: 'About' });

      await expect(firstTab).toBeLeftOf(secondTab);
    });
  });
});
