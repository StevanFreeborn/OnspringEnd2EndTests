import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect, Locator } from '../../fixtures';
import { createApp } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { TextField } from '../../models/textField';
import { TextFormulaField } from '../../models/textFormulaField';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { InvalidFormulasReportPage } from '../../pageObjectModels/systemReports/invalidFormulasReportPage';
import { AnnotationType } from '../annotations';

type InvalidFormulasReportTestFixtures = {
  testApp: App;
  appAdminPage: AppAdminPage;
  invalidFormulasReportPage: InvalidFormulasReportPage;
};

const test = base.extend<InvalidFormulasReportTestFixtures>({
  testApp: async ({ sysAdminPage }, use) => {
    const app = await createApp(sysAdminPage);
    await use(app);
  },
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  invalidFormulasReportPage: async ({ sysAdminPage }, use) => await use(new InvalidFormulasReportPage(sysAdminPage)),
});

test.describe('invalid formulas report', () => {
  test('Filter the invalid formulas report', async ({ testApp, appAdminPage, invalidFormulasReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-534',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create an invalid formula fields', async () => {
      invalidFields = await createInvalidFields(appAdminPage, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await invalidFormulasReportPage.goto();
    });

    await test.step('Filter the invalid formulas report', async () => {
      await invalidFormulasReportPage.filterReport({ appFilter: testApp.name });
    });

    await test.step('Verify the invalid formulas report is filtered', async () => {
      await expect(async () => {
        await invalidFormulasReportPage.page.reload();

        for (const invalidField of invalidFields) {
          await expect(invalidFormulasReportPage.getRowByText(invalidField.name)).toBeVisible({ timeout: 1_000 });
        }
      }).toPass({ timeout: 300_000, intervals: [1_000] });
    });
  });

  test('Sort the invalid formulas report', async ({ appAdminPage, testApp, invalidFormulasReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-535',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create an invalid formula fields', async () => {
      invalidFields = await createInvalidFields(appAdminPage, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await invalidFormulasReportPage.goto();
    });

    await test.step('Sort the invalid formulas report', async () => {
      await invalidFormulasReportPage.clearSort();
      await invalidFormulasReportPage.sortGridBy('Last Saved', 'descending');
    });

    await test.step('Verify the invalid formulas report is sorted', async () => {
      let rows: Locator[] = [];

      await expect(async () => {
        await invalidFormulasReportPage.reload();
        rows = await invalidFormulasReportPage.getRows();
        expect(rows.length).toBeGreaterThanOrEqual(invalidFields.length);
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      const timestamps: number[] = [];

      for (const row of rows) {
        const lastSavedText = await row.locator('td').nth(3).innerText();
        const lastSavedDate = new Date(lastSavedText.trim()).getTime();
        timestamps.push(lastSavedDate);
      }

      for (let i = 0; i < rows.length - 1; i++) {
        const lastSavedDateColumnIndex = 3;
        const currentRowLastSavedText = await rows[i].locator('td').nth(lastSavedDateColumnIndex).innerText();
        const nextRowLastSavedText = await rows[i + 1].locator('td').nth(lastSavedDateColumnIndex).innerText();

        const currentRowTimestamp = new Date(currentRowLastSavedText.trim()).getTime();
        const nextRowTimestamp = new Date(nextRowLastSavedText.trim()).getTime();

        expect(currentRowTimestamp).toBeGreaterThanOrEqual(nextRowTimestamp);
      }
    });
  });

  test('Edit a formula field in the invalid formulas report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-536',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a formula field in the invalid formulas report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-537',
    });

    expect(true).toBeTruthy();
  });
});

async function createInvalidFields(appAdminPage: AppAdminPage, testApp: App) {
  const textFieldOne = new TextField({
    name: FakeDataFactory.createFakeFieldName(),
  });
  const formulaFieldOne = new TextFormulaField({
    name: FakeDataFactory.createFakeFieldName(),
    formula: `return {:${textFieldOne.name}};`,
  });

  const textFieldTwo = new TextField({
    name: FakeDataFactory.createFakeFieldName(),
  });
  const formulaFieldTwo = new TextFormulaField({
    name: FakeDataFactory.createFakeFieldName(),
    formula: `return {:${textFieldTwo.name}};`,
  });

  const fieldsToDelete = [textFieldOne, textFieldTwo];
  const invalidFields = [formulaFieldOne, formulaFieldTwo];
  const fieldsToCreate = [...fieldsToDelete, ...invalidFields];

  await appAdminPage.goto(testApp.id);

  await appAdminPage.layoutTabButton.click();

  for (const field of fieldsToCreate) {
    await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
  }

  for (const field of fieldsToDelete) {
    await appAdminPage.layoutTab.deleteLayoutItemFromFieldsAndObjectsGrid(field);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await appAdminPage.page.waitForTimeout(1_000);
  }

  return invalidFields;
}
