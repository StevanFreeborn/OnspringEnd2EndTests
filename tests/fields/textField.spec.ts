import { LayoutItemType } from '../../componentObjectModels/menus/addLayoutItemMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { AnnotationType } from '../annotations';

type TextFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  appId: number;
};

const test = base.extend<TextFieldTestFixtures>({
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
    await use(appAdminPage);
  },
  appId: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();

    await adminHomePage.goto();
    await adminHomePage.createApp(appName);
    await appAdminPage.page.waitForURL(appAdminPage.pathRegex);
    const appId = appAdminPage.getAppIdFromUrl();

    await use(appId);

    await appsAdminPage.goto();
    await appsAdminPage.deleteApps([appName]);
  },
});

test.describe('text field', () => {
  test.beforeEach(async ({ appAdminPage, appId }) => {
    await appAdminPage.goto(appId);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Text Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-80',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addLayoutItem(LayoutItemType.TextField, fieldName);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Add a copy of a Text Field on an app from the Fields & Objects report using row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-81',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (copy)`;

    await test.step('Add the the text field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItem(LayoutItemType.TextField, fieldName);
    });

    await test.step('Add a copy of the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal(LayoutItemType.TextField);

      await addTextFieldModal.fieldInput.fill(copiedFieldName);
      await addTextFieldModal.fieldInput.fill(copiedFieldName);
      await addTextFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: copiedFieldName });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a copy of a Text Field on an app from the Fields & Objects report using Add Field button.', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-809',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (1)`;

    await test.step('Add the text field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItem(LayoutItemType.TextField, fieldName);
    });

    await test.step('Add a copy of the text field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(LayoutItemType.TextField);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectFieldDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getFieldToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal(LayoutItemType.TextField);

      await expect(addTextFieldModal.fieldInput).toHaveValue(copiedFieldName);

      await addTextFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: copiedFieldName });
      await expect(copiedFieldRow).toBeVisible();
    });
  });
});
