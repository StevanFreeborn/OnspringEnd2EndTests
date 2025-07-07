import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AnnotationType } from '../annotations';

type SectionTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
};

const test = base.extend<SectionTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
});

test.describe('section', () => {
  test("Add a section to an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-46',
    });

    const tabName = 'Tab 2';
    const sectionName = 'New Section';
    const fieldName = 'Record Id';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a new section to the app layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.addSection({
        tabName: tabName,
        sectionName: sectionName,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the section is added successfully', async () => {
      await addContentPage.goto(app.id);

      const recordIdField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'AutoNumber',
      });

      await expect(recordIdField).toBeVisible();
    });
  });

  test("Update a section of an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-47',
    });

    const sectionName = 'Updated Section';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Update a section of the app layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.updateSectionName({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        newSectionName: sectionName,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Record Id',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the section is updated successfully', async () => {
      await addContentPage.goto(app.id);

      const recordIdField = await addContentPage.form.getField({
        tabName: 'Tab 2',
        sectionName: sectionName,
        fieldName: 'Record Id',
        fieldType: 'AutoNumber',
      });

      await expect(recordIdField).toBeVisible();
    });
  });

  test("Delete a section of an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-48',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Delete a section of the app layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.deleteSection({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the section is deleted successfully', async () => {
      await addContentPage.goto(app.id);

      const tabTwo = addContentPage.page.getByRole('tab', { name: 'Tab 2' });

      await expect(tabTwo).toBeHidden();
    });
  });

  test("Add a standalone section to an app's layout", async ({ app, appAdminPage, addContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-49',
    });

    const sectionName = 'Standalone Section';

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add a standalone section to the app layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Record Id',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.addSection({
        sectionName: sectionName,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: 'Last Saved By',
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the standalone section is added successfully', async () => {
      await addContentPage.goto(app.id);

      const standAloneSection = addContentPage.page.locator('.section', {
        has: addContentPage.page.getByRole('heading', { name: sectionName }),
      });
      const tabTwo = addContentPage.page.getByRole('tab', { name: 'Tab 2' });

      await expect(standAloneSection).toBeVisible();
      await expect(standAloneSection).toBeAbove(tabTwo);
    });
  });

  test("Update a standalone section of an app's layout", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-50',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a standalone section of an app's layout", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-51',
    });

    expect(true).toBeTruthy();
  });

  test('Rearrange the sections of an app’s layout', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-52',
    });

    expect(true).toBeTruthy();
  });
});
