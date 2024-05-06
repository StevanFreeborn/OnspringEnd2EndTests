import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ListField } from '../../models/listField';
import { ListValue } from '../../models/listValue';
import { ObjectVisibilityOutcome, ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';
import { ListRuleWithValues } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { TextField } from '../../models/textField';
import { TextFormulaField } from '../../models/textFormulaField';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { AnnotationType } from '../annotations';

type OutcomesTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
};

const test = base.extend<OutcomesTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ appAdminPage }, use) => await use(new AddContentPage(appAdminPage.page)),
  editContentPage: async ({ appAdminPage }, use) => await use(new EditContentPage(appAdminPage.page)),
});

test.describe('Outcomes', () => {
  test('Configure a stop calculation outcome', async ({ app, appAdminPage, addContentPage, editContentPage }) => {
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

    const listValueRule = new ListRuleWithValues({
      fieldName: listField.name,
      operator: 'Contains Any',
      value: ['Yes'],
    });

    const triggerWithStopCalcOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [listValueRule],
      }),
      outcomes: [
        new StopCalculationOutcome({
          status: true,
          fieldsToStop: [formulaField.name],
        }),
      ],
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const getTextFieldParams = {
      fieldName: textField.name,
      fieldType: textField.type as FieldType,
      tabName,
      sectionName,
    };

    const getFormulaFieldParams = {
      fieldName: formulaField.name,
      fieldType: formulaField.type as FieldType,
      tabName,
      sectionName,
    };

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
          tabName: tabName,
          sectionName: sectionName,
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

    await test.step('Create a record with text field value', async () => {
      await addContentPage.goto(app.id);
      const editableTextField = await addContentPage.form.getField(getTextFieldParams);

      await editableTextField.fill('Test Value');

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Verify formula field value is the same as text field value', async () => {
      const textFormulaField = await editContentPage.form.getField(getFormulaFieldParams);

      await expect(textFormulaField).toHaveText(/test value/i);
    });

    await test.step('Update list field to yes and save record', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName: tabName,
        sectionName: sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: listValueRule.values[0] }).click();

      await editContentPage.save();
    });

    await test.step('Change text field value', async () => {
      const editableTextField = await editContentPage.form.getField(getTextFieldParams);

      await editableTextField.clear();
      await editableTextField.pressSequentially('New Test Value', { delay: 150 });

      await editContentPage.save();
    });

    await test.step('Verify formula field value is the same as previous text field value', async () => {
      const textFormulaField = await editContentPage.form.getField(getFormulaFieldParams);

      await expect(textFormulaField).toHaveText(/test value/i);
    });
  });

  test('Configure an object visibility outcome', async ({ app, appAdminPage, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-744',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
    const listField = new ListField({
      name: 'Hide Section',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const tabName = 'Tab 2';
    const sectionToHide = 'Section To Hide';

    const triggerWithObjectVisibilityOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Contains Any',
            value: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new ObjectVisibilityOutcome({
          status: true,
          sections: [
            new ObjectVisibilitySection({
              tabName: tabName,
              name: sectionToHide,
              visibility: 'Hidden',
            }),
          ],
        }),
      ],
    });

    const getTextFieldParams = {
      fieldName: textField.name,
      fieldType: textField.type as FieldType,
      tabName,
      sectionName: sectionToHide,
    };

    await test.step("Navigate to the app's layout tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add list field to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: listField.name,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Create a section and place text field in it', async () => {
      await appAdminPage.layoutTab.openLayout();

      await appAdminPage.layoutTab.layoutDesignerModal.addSection({
        tabName: tabName,
        sectionName: sectionToHide,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionToHide,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: textField.name,
      });

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with object visibility outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithObjectVisibilityOutcome);
    });

    await test.step('Create a record with text field value', async () => {
      await addContentPage.goto(app.id);
      const editableTextField = await addContentPage.form.getField(getTextFieldParams);

      await editableTextField.fill('Test Value');

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Verify text field is visible', async () => {
      const editableTextField = await editContentPage.form.getField(getTextFieldParams);

      await expect(editableTextField).toBeVisible();
    });

    await test.step('Update list field to yes and save record', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName: 'Section 1',
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify text field is not visible', async () => {
      const editableTextField = await editContentPage.form.getField(getTextFieldParams);

      await expect(editableTextField).toBeHidden();
    });
  });
});
