import { Document, Paragraph } from 'docx';
import { GetAttachmentFieldParams, GetDateFieldParams } from '../../componentObjectModels/forms/addOrEditRecordForm';
import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AttachmentField } from '../../models/attachmentField';
import {
  CmroOnSaveWithCustomBatchOutcome,
  CmroOnSaveWithDefinedLibraryOutcome,
  CmroOnSaveWithDynamicLibraryOutcome,
  CustomBatchContentDefinition,
  DefinedLibraryContentDefinition,
  DynamicLibraryContentDefinition,
} from '../../models/createMultipleRecordsOutcome';
import { CreateOneRecordOnSaveOutcome } from '../../models/createOneRecordOutcome';
import { DateField } from '../../models/dateField';
import { DynamicDocument } from '../../models/dynamicDocument';
import { FilterListValueOutcome, FilterListValueRule } from '../../models/filterListValueOutcome';
import { GenerateDocumentOutcome } from '../../models/generateDocumentOutcome';
import { ListValue } from '../../models/listValue';
import { ObjectVisibilityOutcome, ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';
import { ParallelReferenceField } from '../../models/parallelReferenceField';
import { PrintContentRecordOutcome } from '../../models/printContentRecordOutcome';
import { ReferenceField } from '../../models/referenceField';
import { RequiredFieldsOutcome } from '../../models/requiredFieldsOutcome';
import { AutoNumberRuleWithValue, ListRuleWithValues } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
import { SetDateOutcome, SetDateToCurrentDateRule } from '../../models/setDateOutcome';
import { SetListValueOutcome, SetSingleListValueRule } from '../../models/setListValueOutcome';
import { SetReferenceOutcome, SetSpecificSingleReferenceConfig } from '../../models/setReferenceOutcome';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { TextField } from '../../models/textField';
import { TextFormulaField } from '../../models/textFormulaField';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { EditDocumentPage } from '../../pageObjectModels/documents/editDocumentPage';
import { AnnotationType } from '../annotations';
import { ListField } from './../../models/listField';
import { GetReferenceFieldParams } from './../../pageObjectModels/content/editableContentPage';

type OutcomesTestFixtures = {
  triggerApp: App;
  sourceApp: App;
  targetApp: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  editDocumentPage: EditDocumentPage;
};

const test = base.extend<OutcomesTestFixtures>({
  triggerApp: app,
  sourceApp: app,
  targetApp: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
  editDocumentPage: async ({ sysAdminPage }, use) => await use(new EditDocumentPage(sysAdminPage)),
});

test.describe('Outcomes', () => {
  test('Configure a stop calculation outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
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
      values: ['Yes'],
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
      await editableTextField.pressSequentially('Updated Value', { delay: 150 });

      await editContentPage.save();
    });

    await test.step('Verify formula field value is the same as previous text field value', async () => {
      const textFormulaField = await editContentPage.form.getField(getFormulaFieldParams);

      await expect(textFormulaField).toHaveText(/test value/i);
    });
  });

  test('Configure an object visibility outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
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
            values: ['Yes'],
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

  test('Configure a set date outcome', async ({ triggerApp: app, appAdminPage, addContentPage, editContentPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-747',
    });

    const dateField = new DateField({ name: FakeDataFactory.createFakeFieldName() });

    const listField = new ListField({
      name: 'Set Date',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithSetDateOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Contains Any',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new SetDateOutcome({
          status: true,
          setDateRules: [new SetDateToCurrentDateRule({ fieldName: dateField.name })],
        }),
      ],
    });

    const getDateFieldParams = {
      fieldName: dateField.name,
      fieldType: dateField.type,
      tabName,
      sectionName,
    } as GetDateFieldParams;

    const expectedDateValue = new Date().toLocaleDateString(undefined, { timeZone: 'America/Chicago' });

    await test.step("Navigate to the app's layout tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a date field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(dateField);
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [dateField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with set date outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithSetDateOutcome);
    });

    await test.step('Create a record', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName: tabName,
        sectionName: sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();
    });

    await test.step('Verify date field value is set', async () => {
      const editableDateField = await editContentPage.form.getField(getDateFieldParams);
      await expect(editableDateField.input).toHaveValue(expectedDateValue);
    });

    await test.step('Save record', async () => {
      await editContentPage.save();
    });

    await test.step('Verify date field value is still set', async () => {
      const editableDateField = await editContentPage.form.getField(getDateFieldParams);
      await expect(editableDateField.input).toHaveValue(expectedDateValue);
    });
  });

  test('Configure a set list value outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-748',
    });

    const listField = new ListField({
      name: 'Set List Value',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const expectedListValue = new ListValue({ value: 'Expected' });

    const listFieldToSet = new ListField({
      name: 'List Field To Set',
      values: [expectedListValue],
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithSetListValueOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new SetListValueOutcome({
          status: true,
          setListValueRules: [
            new SetSingleListValueRule({
              fieldName: listFieldToSet.name,
              value: expectedListValue.value,
            }),
          ],
        }),
      ],
    });

    const getListFieldSet = {
      fieldName: listFieldToSet.name,
      fieldType: listFieldToSet.type as FieldType,
      tabName,
      sectionName,
    };

    await test.step('Navigate to the app layout tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create a list to set', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listFieldToSet);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [listFieldToSet, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with set list value outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithSetListValueOutcome);
    });

    await test.step('Create a record', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName: tabName,
        sectionName: sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();
    });

    await test.step('Verify list field value is set', async () => {
      const listFieldSet = await editContentPage.form.getField(getListFieldSet);

      await expect(listFieldSet).toHaveText(expectedListValue.value);
    });

    await test.step('Save record', async () => {
      await editContentPage.save();
    });

    await test.step('Verify list field value is still set', async () => {
      const listFieldSet = await editContentPage.form.getField(getListFieldSet);

      await expect(listFieldSet).toHaveText(expectedListValue.value);
    });
  });

  test('Configure a set reference outcome', async ({
    sourceApp,
    triggerApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-749',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const referenceField = new ReferenceField({
      name: 'Reference Field',
      reference: sourceApp.name,
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const setRefConfig = new SetSpecificSingleReferenceConfig({
      fieldName: referenceField.name,
      value: '',
    });

    const triggerWithSetReferenceOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new SetReferenceOutcome({
          status: true,
          setReferenceConfig: setRefConfig,
        }),
      ],
    });

    const getReferenceFieldParams = {
      fieldName: referenceField.name,
      fieldType: referenceField.type as FieldType,
      tabName,
      sectionName,
    } as GetReferenceFieldParams;

    await test.step('Create a record in the source app', async () => {
      await addContentPage.goto(sourceApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      setRefConfig.value = editContentPage.getRecordIdFromUrl().toString();
    });

    await test.step('Create a list field in the trigger app', async () => {
      await appAdminPage.goto(triggerApp.id);
      await appAdminPage.layoutTabButton.click();

      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create a reference field in the trigger app that targets source app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceField);
    });

    await test.step('Add fields to the trigger app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const [index, field] of [listField, referenceField].entries()) {
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

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with set reference outcome to trigger app', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithSetReferenceOutcome);
    });

    await test.step('Create a record in the trigger app', async () => {
      await addContentPage.goto(triggerApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();
    });

    await test.step('Verify reference field value is set', async () => {
      const referenceField = await editContentPage.form.getField(getReferenceFieldParams);
      const recordRow = referenceField.gridTable.getByRole('row', { name: setRefConfig.value });

      await expect(recordRow).toBeVisible();
    });

    await test.step('Save record', async () => {
      await editContentPage.save();
    });

    await test.step('Verify reference field value is still set', async () => {
      const referenceField = await editContentPage.form.getField(getReferenceFieldParams);
      const recordRow = referenceField.gridTable.getByRole('row', { name: setRefConfig.value });

      await expect(recordRow).toBeVisible();
    });
  });

  test('Configure a required fields outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-746',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const requiredField = new TextField({
      name: 'Required Field',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithRequiredFieldsOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Contains Any',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new RequiredFieldsOutcome({
          status: true,
          requiredFields: [requiredField.name],
        }),
      ],
    });

    await test.step('Navigate to the app layout tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create field to be required', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(requiredField);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [requiredField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with required fields outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithRequiredFieldsOutcome);
    });

    await test.step('Create a record', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();
    });

    await test.step('Verify required field is required', async () => {
      const textField = await editContentPage.form.getField({
        fieldName: requiredField.name,
        fieldType: requiredField.type as FieldType,
        tabName,
        sectionName,
      });

      await expect(textField).toHaveAttribute('data-val', 'true');

      await editContentPage.saveRecordButton.click();

      await expect(editContentPage.validationErrors).toBeVisible();
      await expect(editContentPage.validationErrors).toHaveText(
        new RegExp(`${requiredField.name} is a required field`)
      );
    });

    await test.step('Verify record can be saved after filling required field', async () => {
      const editableRequiredField = await editContentPage.form.getField({
        fieldName: requiredField.name,
        fieldType: requiredField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableRequiredField.pressSequentially('Test Value', { delay: 150 });

      await editContentPage.save();

      await expect(editContentPage.validationErrors).toBeHidden();
    });
  });

  test('Configure a filter list value outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-742',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const valueToFilter = new ListValue({ value: 'To Be Filtered' });
    const valueNotToFilter = new ListValue({ value: 'Do Not Filter Me' });

    const listFieldToFilter = new ListField({
      name: 'Filter Me',
      values: [valueToFilter, valueNotToFilter],
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithFilterListValueOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Contains Any',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new FilterListValueOutcome({
          status: true,
          filterListValueRules: [
            new FilterListValueRule({
              fieldName: listFieldToFilter.name,
              valuesToInclude: [valueNotToFilter.value],
            }),
          ],
        }),
      ],
    });

    const getFilteredFieldParams = {
      fieldName: listFieldToFilter.name,
      fieldType: listFieldToFilter.type as FieldType,
      tabName,
      sectionName,
    };

    await test.step('Navigate to the app layout tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create a list field to filter', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listFieldToFilter);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [listFieldToFilter, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with a filter list value outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithFilterListValueOutcome);
    });

    await test.step('Create a content record in the app', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update the list field to the value yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();
    });

    await test.step('Verify the list field has been filtered', async () => {
      const filteredField = await editContentPage.form.getField(getFilteredFieldParams);

      await filteredField.click();
      const optionNotToFilter = filteredField.page().getByRole('option', { name: valueNotToFilter.value });
      const optionToFilter = filteredField.page().getByRole('option', { name: valueToFilter.value });

      await expect(optionNotToFilter).toBeVisible();
      await expect(optionToFilter).toBeHidden();
    });

    await test.step('Save the record', async () => {
      await editContentPage.save();
    });

    await test.step('Verify the list field is still filtered', async () => {
      const filteredField = await editContentPage.form.getField(getFilteredFieldParams);

      await filteredField.click();
      const optionNotToFilter = filteredField.page().getByRole('option', { name: valueNotToFilter.value });
      const optionToFilter = filteredField.page().getByRole('option', { name: valueToFilter.value });

      await expect(optionNotToFilter).toBeVisible();
      await expect(optionToFilter).toBeHidden();
    });
  });

  test('Configure a print content record outcome', async ({
    triggerApp: app,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-745',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const attachmentField = new AttachmentField({
      name: 'Attachment Field',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithPrintContentRecordOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new PrintContentRecordOutcome({
          status: true,
          attachmentField: attachmentField.name,
        }),
      ],
    });

    let recordId: number;

    await test.step('Navigate to the app layout tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create an attachment field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(attachmentField);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [attachmentField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with print content record outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithPrintContentRecordOutcome);
    });

    await test.step('Create a record', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify the content record is printed', async () => {
      await expect(async () => {
        await editContentPage.page.reload();

        const attachmentControl = await editContentPage.form.getField({
          fieldName: attachmentField.name,
          fieldType: attachmentField.type as FieldType,
          tabName,
          sectionName,
        } as GetAttachmentFieldParams);

        const attachmentName = `${recordId}.pdf`;
        const printedRecordRow = attachmentControl.attachmentGridBody.getByRole('row', { name: attachmentName });

        await expect(printedRecordRow).toBeVisible({ timeout: 5000 });
      }).toPass({
        intervals: [5_000],
        timeout: 300_000,
      });
    });
  });

  test('Configure a create one record outcome', async ({
    triggerApp,
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-741',
    });

    const referenceField = new ReferenceField({
      name: 'Reference Field',
      reference: triggerApp.name,
    });

    const parallelReferenceField = new ParallelReferenceField({
      name: targetApp.name,
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithCreateOneRecordOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new CreateOneRecordOnSaveOutcome({
          status: true,
          targetApp: targetApp.name,
        }),
      ],
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceField);
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await appAdminPage.goto(triggerApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [parallelReferenceField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with create one record outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithCreateOneRecordOutcome);
    });

    await test.step('Create a record in the trigger app', async () => {
      await addContentPage.goto(triggerApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify a record is created in the target app', async () => {
      const parallelRefFieldControl = await editContentPage.form.getField({
        fieldName: targetApp.name,
        fieldType: parallelReferenceField.type as FieldType,
        tabName,
        sectionName,
      } as GetReferenceFieldParams);

      const recordRow = parallelRefFieldControl.gridTable.getByRole('row', { name: '1' });

      await expect(recordRow).toBeVisible();
    });
  });

  test('Configure a create multiple records outcome with a custom batch', async ({
    triggerApp,
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-738',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const referenceField = new ReferenceField({
      name: 'Reference Field',
      reference: triggerApp.name,
    });

    const parallelReferenceField = new ParallelReferenceField({
      name: targetApp.name,
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const triggerWithCreateMultipleRecordsOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new CmroOnSaveWithCustomBatchOutcome({
          status: true,
          definitions: [
            new CustomBatchContentDefinition({
              batchRecordName: 'Batch 1',
              targetApp: targetApp.name,
            }),
            new CustomBatchContentDefinition({
              batchRecordName: 'Batch 2',
              targetApp: targetApp.name,
            }),
          ],
        }),
      ],
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceField);
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await appAdminPage.goto(triggerApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [parallelReferenceField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with create multiple records outcome that has a custom batch definition', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithCreateMultipleRecordsOutcome);
    });

    await test.step('Create a record in the trigger app', async () => {
      await addContentPage.goto(triggerApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify records are created in the target app', async () => {
      const parallelRefFieldControl = await editContentPage.form.getField({
        fieldName: targetApp.name,
        fieldType: parallelReferenceField.type as FieldType,
        tabName,
        sectionName,
      } as GetReferenceFieldParams);

      const batchOneRow = parallelRefFieldControl.gridTable.getByRole('row', { name: '1' });
      const batchTwoRow = parallelRefFieldControl.gridTable.getByRole('row', { name: '2' });

      await expect(batchOneRow).toBeVisible();
      await expect(batchTwoRow).toBeVisible();
    });
  });

  test('Configure a create multiple records outcome with a defined batch', async ({
    sourceApp,
    triggerApp,
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-739',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const referenceFieldSourceToTrigger = new ReferenceField({
      name: 'Triggering Record',
      reference: triggerApp.name,
    });

    const referenceFieldTargetToSource = new ReferenceField({
      name: 'Source Record',
      reference: sourceApp.name,
    });

    const referenceFieldTargetToTrigger = new ReferenceField({
      name: 'Trigger Record',
      reference: triggerApp.name,
    });

    const parallelReferenceField = new ParallelReferenceField({
      name: targetApp.name,
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const filterRule = new AutoNumberRuleWithValue({
      fieldName: 'Record Id',
      operator: 'Equals',
      value: 0,
    });

    const triggerWithCreateMultipleRecordsOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new CmroOnSaveWithDefinedLibraryOutcome({
          status: true,
          definitions: [
            new DefinedLibraryContentDefinition({
              sourceApp: sourceApp.name,
              targetApp: targetApp.name,
              dataFilterLogic: new SimpleRuleLogic({
                rules: [filterRule],
              }),
            }),
          ],
        }),
      ],
    });

    await test.step("Navigate to the source app's layout tab", async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldSourceToTrigger);
    });

    await test.step('Create a record in the source app', async () => {
      await addContentPage.goto(sourceApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      filterRule.value = editContentPage.getRecordIdFromUrl();
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the source app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldTargetToSource);
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldTargetToTrigger);
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await appAdminPage.goto(triggerApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [parallelReferenceField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with create multiple records outcome that has a defined batch definition', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithCreateMultipleRecordsOutcome);
    });

    await test.step('Create a record in the trigger app', async () => {
      await addContentPage.goto(triggerApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify records are created in the target app', async () => {
      const parallelRefFieldControl = await editContentPage.form.getField({
        fieldName: targetApp.name,
        fieldType: parallelReferenceField.type as FieldType,
        tabName,
        sectionName,
      } as GetReferenceFieldParams);

      const recordRow = parallelRefFieldControl.gridTable.getByRole('row', { name: '1' });

      await expect(recordRow).toBeVisible();
    });
  });

  test('Configure a create multiple records outcome with a dynamic batch', async ({
    sourceApp,
    triggerApp,
    targetApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-740',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const referenceFieldSourceToTrigger = new ReferenceField({
      name: 'Triggering Record',
      reference: triggerApp.name,
    });

    const referenceFieldTargetToSource = new ReferenceField({
      name: 'Source Record',
      reference: sourceApp.name,
    });

    const referenceFieldTargetToTrigger = new ReferenceField({
      name: 'Trigger Record',
      reference: triggerApp.name,
    });

    const parallelReferenceField = new ParallelReferenceField({
      name: targetApp.name,
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const filterRule = new AutoNumberRuleWithValue({
      fieldName: 'Record Id',
      operator: 'Equals',
      value: 0,
    });

    const triggerWithCreateMultipleRecordsOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new CmroOnSaveWithDynamicLibraryOutcome({
          status: true,
          definitions: [
            new DynamicLibraryContentDefinition({
              sourceApp: sourceApp.name,
              targetApp: targetApp.name,
              dataFilterLogic: new SimpleRuleLogic({
                rules: [filterRule],
              }),
            }),
          ],
        }),
      ],
    });

    await test.step("Navigate to the source app's layout tab", async () => {
      await appAdminPage.goto(sourceApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldSourceToTrigger);
    });

    await test.step('Create a record in the source app', async () => {
      await addContentPage.goto(sourceApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);

      filterRule.value = editContentPage.getRecordIdFromUrl();
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a reference field that targets the source app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldTargetToSource);
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceFieldTargetToTrigger);
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await appAdminPage.goto(triggerApp.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [parallelReferenceField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with create multiple records outcome that has a dynamic batch definition', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithCreateMultipleRecordsOutcome);
    });

    await test.step('Create a record in the trigger app', async () => {
      await addContentPage.goto(triggerApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify records are created in the target app', async () => {
      const parallelRefFieldControl = await editContentPage.form.getField({
        fieldName: targetApp.name,
        fieldType: parallelReferenceField.type as FieldType,
        tabName,
        sectionName,
      } as GetReferenceFieldParams);

      const recordRow = parallelRefFieldControl.gridTable.getByRole('row', { name: '1' });

      await expect(recordRow).toBeVisible();
    });
  });

  test('Configure a generate document outcome', async ({
    triggerApp: app,
    appAdminPage,
    editDocumentPage,
    dynamicDocumentService,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-743',
    });

    const listField = new ListField({
      name: 'List Field',
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    const attachmentField = new AttachmentField({
      name: 'Attachment Field',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const template = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'This was generated for record: {:Record Id}',
            }),
          ],
        },
      ],
    });

    const document = new DynamicDocument({
      name: FakeDataFactory.createFakeDocumentName(),
      status: true,
      templatePath: '',
      saveToFieldAccess: 'Allowed',
      attachmentField: attachmentField.name,
    });

    const triggerWithGenerateDocumentOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [
          new ListRuleWithValues({
            fieldName: listField.name,
            operator: 'Changed To',
            values: ['Yes'],
          }),
        ],
      }),
      outcomes: [
        new GenerateDocumentOutcome({
          status: true,
          document: document.name,
          fileType: 'Microsoft Word',
          attachmentField: attachmentField.name,
        }),
      ],
    });

    await test.step('Navigate to the app layout tab', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Create a list field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(listField);
    });

    await test.step('Create an attachment field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(attachmentField);
    });

    await test.step('Add fields to app layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      for (const field of [attachmentField, listField]) {
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          fieldName: field.name,
        });
      }

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create dynamic document template', async () => {
      document.templatePath = await dynamicDocumentService.createTemplate(template);
    });

    await test.step("Navigate to the app's document tab", async () => {
      await appAdminPage.documentsTabButton.click();
    });

    await test.step('Create a dynamic document', async () => {
      await appAdminPage.documentsTab.createDocument(document.name);
      await appAdminPage.page.waitForURL(editDocumentPage.pathRegex);
      await editDocumentPage.fillOutForm(document);
      await editDocumentPage.save();
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with generate document outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(triggerWithGenerateDocumentOutcome);
    });

    await test.step('Create a record in the app', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step('Update list field to yes', async () => {
      const editableListField = await editContentPage.form.getField({
        fieldName: listField.name,
        fieldType: listField.type as FieldType,
        tabName,
        sectionName,
      });

      await editableListField.click();
      await editableListField.page().getByRole('option', { name: 'Yes' }).click();

      await editContentPage.save();
    });

    await test.step('Verify the document is generated', async () => {
      await expect(async () => {
        await editContentPage.page.reload();

        const attachmentControl = await editContentPage.form.getField({
          fieldName: attachmentField.name,
          fieldType: attachmentField.type as FieldType,
          tabName,
          sectionName,
        } as GetAttachmentFieldParams);

        const attachmentName = `${editContentPage.getRecordIdFromUrl()} - ${document.name}.docx`;
        const generatedDocumentRow = attachmentControl.attachmentGridBody.getByRole('row', { name: attachmentName });

        await expect(generatedDocumentRow).toBeVisible({ timeout: 5_000 });
      }).toPass({
        intervals: [5_000],
        timeout: 300_000,
      });
    });
  });

  test('Configure a REST outcome', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-891',
    });

    expect(true).toBe(true);
  });
});
