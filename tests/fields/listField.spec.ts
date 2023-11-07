import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { ListField, ListValue } from '../../models/listField';
import { AnnotationType } from '../annotations';

test.describe('list field', async () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a List Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-60',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    await test.step('Add the list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a List Field on an app from the Fields & Objects report using row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-61',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the list field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the list field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addListFieldModal = appAdminPage.layoutTab.getLayoutItemModal('List');

      await expect(addListFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addListFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a List Field on an app from the Fields & Objects report using Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-815',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the list field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the list field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addListFieldModal = appAdminPage.layoutTab.getLayoutItemModal('List');

      await expect(addListFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addListFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });
});
