import { App, FakeDataFactory, TextField, TextFormulaField } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  FieldTargets,
  FieldTasks,
  InvalidFormulasReportTargets,
  InvalidFormulasReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, expect, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type InvalidFormulasReportTestFixtures = {
  testApp: App;
};

const test = base.extend<InvalidFormulasReportTestFixtures>({
  testApp: AppFixture.create().build(),
});

test.describe('invalid formulas report', () => {
  test('Filter the invalid formulas report', async ({ testApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-534',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create invalid formula fields', async () => {
      invalidFields = await createInvalidFields(sysAdminActor, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.goto());
    });

    await test.step('Filter the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.filterReport({ appFilter: testApp.name }));
    });

    await test.step('Verify the invalid formulas report is filtered', async () => {
      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.reload());

        for (const invalidField of invalidFields) {
          await sysAdminActor
            .browse()
            .check(InvalidFormulasReportTargets.rowByText(invalidField.name))
            .isVisible({ timeout: 1_000 });
        }
      }).toPass({ timeout: 300_000, intervals: [1_000] });
    });
  });

  test('Sort the invalid formulas report', async ({ sysAdminActor, testApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-535',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create invalid formula fields', async () => {
      invalidFields = await createInvalidFields(sysAdminActor, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.goto());
    });

    await test.step('Sort the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(
        InvalidFormulasReportTasks.clearSort(),
        InvalidFormulasReportTasks.sortGridBy('Last Saved', 'descending')
      );
    });

    await test.step('Verify the invalid formulas report is sorted', async () => {
      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.reload());
        const rowCount = await sysAdminActor.browse().count(InvalidFormulasReportTargets.rows);
        expect(rowCount).toBeGreaterThanOrEqual(invalidFields.length);
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      const lastSavedTexts = await sysAdminActor.browse().getAllTexts(InvalidFormulasReportTargets.lastSavedCells);

      for (let i = 0; i < lastSavedTexts.length - 1; i++) {
        const currentRowTimestamp = new Date(lastSavedTexts[i].trim()).getTime();
        const nextRowTimestamp = new Date(lastSavedTexts[i + 1].trim()).getTime();

        expect(currentRowTimestamp).toBeGreaterThanOrEqual(nextRowTimestamp);
      }
    });
  });

  test('Edit a formula field in the invalid formulas report', async ({ sysAdminActor, testApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-536',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create invalid formula fields', async () => {
      invalidFields = await createInvalidFields(sysAdminActor, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.goto());
    });

    await test.step('Edit a field in the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.filterReport({ appFilter: testApp.name }));

      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.reload());
        await sysAdminActor
          .browse()
          .check(InvalidFormulasReportTargets.rowByText(invalidFields[0].name))
          .isVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      await sysAdminActor.attemptsTo(
        InvalidFormulasReportTasks.openEditModal(invalidFields[0].name),
        FieldTasks.updateOpenFormulaModal({ status: 'Enabled', formula: 'return null' })
      );
    });

    await test.step('Verify the field was edited', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(testApp.id));

      await sysAdminActor
        .browse()
        .check(FieldTargets.rowByName(invalidFields[0].name))
        .hasText(/Enabled/);
    });
  });

  test('Delete a formula field in the invalid formulas report', async ({ sysAdminActor, testApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-537',
    });

    let invalidFields: TextFormulaField[];

    await test.step('Create invalid formula fields', async () => {
      invalidFields = await createInvalidFields(sysAdminActor, testApp);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.goto());
    });

    await test.step('Delete a field in the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.filterReport({ appFilter: testApp.name }));

      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.reload());
        await sysAdminActor
          .browse()
          .check(InvalidFormulasReportTargets.rowByText(invalidFields[0].name))
          .isVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      await sysAdminActor.attemptsTo(InvalidFormulasReportTasks.deleteField(invalidFields[0].name));
    });

    await test.step('Verify the field was deleted', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(testApp.id));

      await sysAdminActor.browse().check(FieldTargets.rowByName(invalidFields[0].name)).isHidden();
    });
  });
});

async function createInvalidFields(actor: WebActor, testApp: App) {
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

  await actor.attemptsTo(AppTasks.gotoAppLayoutTab(testApp.id));

  for (const field of fieldsToCreate) {
    await actor.attemptsTo(FieldTasks.addFromGrid(field));
  }

  for (const field of fieldsToDelete) {
    await actor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
    await actor.browse().waitForTimeout(1_000);
  }

  return invalidFields;
}
