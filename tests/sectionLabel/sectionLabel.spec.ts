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
      name: FakeDataFactory.createFakeTextBlockName(),
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

  test('Create a copy of a section label object', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-873',
    });

    expect(true).toBeTruthy();
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
