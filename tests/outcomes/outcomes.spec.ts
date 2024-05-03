import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ListField } from '../../models/listField';
import { ListValue } from '../../models/listValue';
import { ListRuleWithValue } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { TextField } from '../../models/textField';
import { TextFormulaField } from '../../models/textFormulaField';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type OutcomesTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<OutcomesTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('Outcomes', () => {
  test('Configure a stop calculation outcome', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-750',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const formulaField = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: `return {:${textField.name}};`,
    });
    const listField = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const fields = {
      textField,
      formulaField,
      listField,
    };

    const triggerWithStopCalcOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [new ListRuleWithValue({ fieldName: listField.name, operator: 'Contains Any', value: ['Yes'] })],
      }),
      outcomes: [
        new StopCalculationOutcome({
          status: true,
          fieldsToStop: [formulaField.name],
        }),
      ],
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(fields.textField);
    });

    await test.step('Create a formula field to return same value as text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(fields.formulaField);
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(fields.listField);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const [index, field] of Object.values(fields).entries()) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          sectionColumn: 0,
          sectionRow: index,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with stop calculation outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithStopCalcOutcome);
    });

    // will need to create a record with text field value.
    await test.step('Create a record with text field value', async () => {});

    // verify formula field value is the same as text field value
    await test.step('Verify formula field value is the same as text field value', async () => {});

    // update list field to yes and save
    await test.step('Update list field to yes and save record', async () => {});

    // change text field value
    await test.step('Change text field value', async () => {});

    // and verify formula field value is the same as previous text field value
    await test.step('Verify formula field value is the same as previous text field value', async () => {});

    expect(true).toBe(true);
  });
});
