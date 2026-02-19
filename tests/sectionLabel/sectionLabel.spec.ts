import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, layoutItemTest as test } from '../../fixtures';
import { SectionLabel } from '../../models/sectionLabel';
import { AnnotationType } from '../annotations';

test.describe('section label object', () => {
  test('Add a section label object to an app', async ({ appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-872',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Verify the section label was added', async () => {
      const sectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: sectionLabel.name });
      await expect(sectionLabelRow).toBeVisible();
    });
  });

  // NOTE: Currently broken: https://corp.onspring.com/Content/8/4940
  test.fail('Create a copy of a section label object', async ({ appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-873',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });
    const copiedSectionLabelName = `${sectionLabel.name} (1)`;

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Add a copy of the section label', async () => {
      const sectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: sectionLabel.name });

      await sectionLabelRow.hover();
      await sectionLabelRow.getByTitle('Copy').click();

      const addSectionLabelModal = appAdminPage.layoutTab.getLayoutItemModal('Section Label');

      await addSectionLabelModal.generalTab.nameInput.waitFor({ timeout: 1000 });
      await expect(addSectionLabelModal.generalTab.nameInput).toHaveValue(copiedSectionLabelName);
      await addSectionLabelModal.save();
    });

    await test.step('Verify the section label was copied', async () => {
      const copiedSectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedSectionLabelName,
      });

      await copiedSectionLabelRow.waitFor();
      await expect(copiedSectionLabelRow).toBeVisible();
    });
  });

  test("Add a section label object to an app's layout", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-874',
    });

    expect(true).toBeTruthy();
  });

  test('Update the configuration of a Section Label Object in an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-875',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Section Label Object from an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-876',
    });

    expect(true).toBeTruthy();
  });
});
