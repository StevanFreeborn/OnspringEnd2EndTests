import {
  App,
  AttachmentField,
  AutoNumberRuleWithValue,
  CmroOnSaveWithCustomBatchOutcome,
  CmroOnSaveWithDefinedLibraryOutcome,
  CmroOnSaveWithDynamicLibraryOutcome,
  CreateOneRecordOnSaveOutcome,
  CustomBatchContentDefinition,
  DateField,
  DefinedLibraryContentDefinition,
  DynamicDocument,
  DynamicLibraryContentDefinition,
  FakeDataFactory,
  FilterListValueOutcome,
  FilterListValueRule,
  GenerateDocumentOutcome,
  ListField,
  ListRuleWithValues,
  ListValue,
  ObjectVisibilityOutcome,
  ObjectVisibilitySection,
  ParallelReferenceField,
  PrintContentRecordOutcome,
  ReferenceField,
  RequiredFieldsOutcome,
  RestApiOutcome,
  SetDateOutcome,
  SetDateToCurrentDateRule,
  SetListValueOutcome,
  SetReferenceOutcome,
  SetSingleListValueRule,
  SetSpecificSingleReferenceConfig,
  SimpleRuleLogic,
  StopCalculationOutcome,
  TextField,
  TextFormulaField,
  Trigger,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  DynamicDocumentTasks,
  FieldTasks,
  TriggerTasks,
} from '@stevanfreeborn/onspring-ui';
import { Retry } from '@stevanfreeborn/screenplay-playwright';
import { Document, Paragraph } from 'docx';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type OutcomesTestFixtures = {
  triggerApp: App;
  sourceApp: App;
  targetApp: App;
};

const test = base.extend<OutcomesTestFixtures>({
  triggerApp: AppFixture.create().build(),
  sourceApp: AppFixture.create().build(),
  targetApp: AppFixture.create().build(),
});

test.describe('Outcomes', () => {
  test('Configure a stop calculation outcome', async ({ triggerApp: app, sysAdminActor }) => {
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

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a text field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(fields.textField));
    });

    await test.step('Create a formula field to return same value as text field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(fields.formulaField));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(fields.listField));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const [index, field] of Object.values(fields).entries()) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: index,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with stop calculation outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithStopCalcOutcome));
    });

    await test.step('Create a record with text field value', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.fillTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: 'Test Value',
        }),
        ContentTasks.saveRecord()
      );
    });

    await test.step('Verify formula field value is the same as text field value', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.formulaFieldInSection(section, formulaField.name))
        .hasText(/test value/i);
    });

    await test.step('Update list field to yes and save record', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: listValueRule.values[0],
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Change text field value', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.typeTextField({
          tabName,
          sectionName,
          fieldName: textField.name,
          value: 'Updated Value',
          delay: 150,
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify formula field value is the same as previous text field value', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.formulaFieldInSection(section, formulaField.name))
        .hasText(/test value/i);
    });
  });

  test('Configure an object visibility outcome', async ({ triggerApp: app, sysAdminActor }) => {
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
              tabName,
              name: sectionToHide,
              visibility: 'Hidden',
            }),
          ],
        }),
      ],
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add list field to app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: listField.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a text field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(textField));
    });

    await test.step('Create a section and place text field in it', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutSection({
          tabName,
          sectionName: sectionToHide,
        }),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName: sectionToHide,
          column: 0,
          row: 0,
          fieldName: textField.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with object visibility outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithObjectVisibilityOutcome));
    });

    await test.step('Create a record with text field value', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.fillTextField({
          tabName,
          sectionName: sectionToHide,
          fieldName: textField.name,
          value: 'Test Value',
        }),
        ContentTasks.saveRecord()
      );
    });

    await test.step('Verify text field is visible', async () => {
      const hiddenSection = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName: sectionToHide }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.textFieldInSection(hiddenSection, textField.name))
        .isVisible();
    });

    await test.step('Update list field to yes and save record', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName: 'Section 1',
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify text field is not visible', async () => {
      const hiddenSection = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName: sectionToHide }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.textFieldInSection(hiddenSection, textField.name))
        .isHidden();
    });
  });

  test('Configure a set date outcome', async ({ triggerApp: app, sysAdminActor }) => {
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

    const expectedDateValue = new Date().toLocaleDateString(undefined, { timeZone: 'America/Chicago' });

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a date field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(dateField));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [dateField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with set date outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithSetDateOutcome));
    });

    await test.step('Create a record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        })
      );
    });

    await test.step('Verify date field value is set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.dateFieldInputInSection(section, dateField.name))
        .hasValue(expectedDateValue);
    });

    await test.step('Save record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveEditedRecord());
    });

    await test.step('Verify date field value is still set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.dateFieldInputInSection(section, dateField.name))
        .hasValue(expectedDateValue);
    });
  });

  test('Configure a set list value outcome', async ({ triggerApp: app, sysAdminActor }) => {
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

    await test.step('Navigate to the app layout tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Create a list to set', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listFieldToSet));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [listFieldToSet, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with set list value outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithSetListValueOutcome));
    });

    await test.step('Create a record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        })
      );
    });

    await test.step('Verify list field value is set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.listFieldInSection(section, listFieldToSet.name))
        .hasText(expectedListValue.value);
    });

    await test.step('Save record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveEditedRecord());
    });

    await test.step('Verify list field value is still set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.listFieldInSection(section, listFieldToSet.name))
        .hasText(expectedListValue.value);
    });
  });

  test('Configure a set reference outcome', async ({ sourceApp, triggerApp, sysAdminActor }) => {
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

    await test.step('Create a record in the source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
      setRefConfig.value = (await sysAdminActor.asks(ContentQuestions.currentRecordId())).toString();
    });

    await test.step('Create a list field in the trigger app', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(triggerApp.id), FieldTasks.addFromGrid(listField));
    });

    await test.step('Create a reference field in the trigger app that targets source app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceField));
    });

    await test.step('Add fields to the trigger app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const [index, field] of [listField, referenceField].entries()) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: index,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(triggerApp.id));
    });

    await test.step('Add a trigger with set reference outcome to trigger app', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithSetReferenceOutcome));
    });

    await test.step('Create a record in the trigger app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(triggerApp.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        })
      );
    });

    await test.step('Verify reference field value is set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, referenceField.name, setRefConfig.value))
        .isVisible();
    });

    await test.step('Save record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveEditedRecord());
    });

    await test.step('Verify reference field value is still set', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, referenceField.name, setRefConfig.value))
        .isVisible();
    });
  });

  test('Configure a required fields outcome', async ({ triggerApp: app, sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Create field to be required', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(requiredField));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [requiredField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with required fields outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithRequiredFieldsOutcome));
    });

    await test.step('Create a record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        })
      );
    });

    await test.step('Verify required field is required', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.textFieldInSection(section, requiredField.name))
        .hasAttribute('data-val', 'true');

      await sysAdminActor.browse().click(ContentRecordTargets.saveRecordButton);

      await sysAdminActor.browse().check(ContentRecordTargets.validationErrors).isVisible();
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.validationErrors)
        .hasText(new RegExp(`${requiredField.name} is a required field`));
    });

    await test.step('Verify record can be saved after filling required field', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.typeTextField({
          tabName,
          sectionName,
          fieldName: requiredField.name,
          value: 'Test Value',
          delay: 150,
        }),
        ContentTasks.saveEditedRecord()
      );

      await sysAdminActor.browse().check(ContentRecordTargets.validationErrors).isHidden();
    });
  });

  test('Configure a filter list value outcome', async ({ triggerApp: app, sysAdminActor }) => {
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

    await test.step('Navigate to the app layout tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Create a list field to filter', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listFieldToFilter));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [listFieldToFilter, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with a filter list value outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithFilterListValueOutcome));
    });

    await test.step('Create a content record in the app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Update the list field to the value yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        })
      );
    });

    await test.step('Verify the list field has been filtered', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor.browse().click(ContentRecordTargets.listFieldInSection(section, listFieldToFilter.name));
      await sysAdminActor.browse().check(ContentRecordTargets.dropdownOption(valueNotToFilter.value)).isVisible();
      await sysAdminActor.browse().check(ContentRecordTargets.dropdownOption(valueToFilter.value)).isHidden();
    });

    await test.step('Save the record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.saveEditedRecord());
    });

    await test.step('Verify the list field is still filtered', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor.browse().click(ContentRecordTargets.listFieldInSection(section, listFieldToFilter.name));
      await sysAdminActor.browse().check(ContentRecordTargets.dropdownOption(valueNotToFilter.value)).isVisible();
      await sysAdminActor.browse().check(ContentRecordTargets.dropdownOption(valueToFilter.value)).isHidden();
    });
  });

  test('Configure a print content record outcome', async ({ triggerApp: app, sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Create an attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(attachmentField));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [attachmentField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Navigate to the app trigger tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with print content record outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithPrintContentRecordOutcome));
    });

    await test.step('Create a record', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify the content record is printed', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.browse().reload();
            const section = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
            const printedRecordRow = ContentRecordTargets.attachmentRowInSection(
              section,
              attachmentField.name,
              `${recordId}.pdf`
            );
            await actor.browse().check(printedRecordRow).isVisible({ timeout: 5_000 });
          },
          {
            intervals: [5_000],
            timeout: 300_000,
          }
        )
      );
    });
  });

  test('Configure a create one record outcome', async ({ triggerApp, targetApp, sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceField));
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(triggerApp.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [parallelReferenceField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(triggerApp.id));
    });

    await test.step('Add a trigger with create one record outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithCreateOneRecordOutcome));
    });

    await test.step('Create a record in the trigger app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(triggerApp.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify a record is created in the target app', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, targetApp.name, '1'))
        .isVisible();
    });
  });

  test('Configure a create multiple records outcome with a custom batch', async ({
    triggerApp,
    targetApp,
    sysAdminActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceField));
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(triggerApp.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [parallelReferenceField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(triggerApp.id));
    });

    await test.step('Add a trigger with create multiple records outcome that has a custom batch definition', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithCreateMultipleRecordsOutcome));
    });

    await test.step('Create a record in the trigger app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(triggerApp.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify records are created in the target app', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, targetApp.name, '1'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, targetApp.name, '2'))
        .isVisible();
    });
  });

  test('Configure a create multiple records outcome with a defined batch', async ({
    sourceApp,
    triggerApp,
    targetApp,
    sysAdminActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(sourceApp.id));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldSourceToTrigger));
    });

    await test.step('Create a record in the source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
      filterRule.value = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Create a reference field that targets the source app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldTargetToSource));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldTargetToTrigger));
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(triggerApp.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [parallelReferenceField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(triggerApp.id));
    });

    await test.step('Add a trigger with create multiple records outcome that has a defined batch definition', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithCreateMultipleRecordsOutcome));
    });

    await test.step('Create a record in the trigger app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(triggerApp.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify records are created in the target app', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, targetApp.name, '1'))
        .isVisible();
    });
  });

  test('Configure a create multiple records outcome with a dynamic batch', async ({
    sourceApp,
    triggerApp,
    targetApp,
    sysAdminActor,
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
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(sourceApp.id));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldSourceToTrigger));
    });

    await test.step('Create a record in the source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
      filterRule.value = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step("Navigate to the target app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(targetApp.id));
    });

    await test.step('Create a reference field that targets the source app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldTargetToSource));
    });

    await test.step('Create a reference field that targets the trigger app', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(referenceFieldTargetToTrigger));
    });

    await test.step("Navigate to the trigger app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(triggerApp.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Add the list field and parallel reference field to the trigger app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [parallelReferenceField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step("Navigate to the trigger app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(triggerApp.id));
    });

    await test.step('Add a trigger with create multiple records outcome that has a dynamic batch definition', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithCreateMultipleRecordsOutcome));
    });

    await test.step('Create a record in the trigger app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(triggerApp.id), ContentTasks.saveRecord());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify records are created in the target app', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.referenceRecordRowInSection(section, targetApp.name, '1'))
        .isVisible();
    });
  });

  test('Configure a generate document outcome', async ({ triggerApp: app, dynamicDocumentService, sysAdminActor }) => {
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

    let recordId: number;

    await test.step('Navigate to the app layout tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(listField));
    });

    await test.step('Create an attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(attachmentField));
    });

    await test.step('Add fields to app layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

      for (const field of [attachmentField, listField]) {
        await sysAdminActor.attemptsTo(
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            column: 0,
            row: 0,
            fieldName: field.name,
          })
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Create dynamic document template', async () => {
      document.templatePath = await dynamicDocumentService.createTemplate(template);
    });

    await test.step("Navigate to the app's document tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppDocumentsTab(app.id));
    });

    await test.step('Create a dynamic document', async () => {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.createFromAppDocumentsTab(document.name),
        DynamicDocumentTasks.fillForm(document),
        DynamicDocumentTasks.save()
      );
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with generate document outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithGenerateDocumentOutcome));
    });

    await test.step('Create a record in the app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Update list field to yes', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: listField.name,
          value: 'Yes',
        }),
        ContentTasks.saveEditedRecord()
      );
    });

    await test.step('Verify the document is generated', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.browse().reload();
            const section = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
            const generatedDocumentRow = ContentRecordTargets.attachmentRowInSection(
              section,
              attachmentField.name,
              `${recordId} - ${document.name}.docx`
            );
            await actor.browse().check(generatedDocumentRow).isVisible({ timeout: 5_000 });
          },
          {
            intervals: [5_000],
            timeout: 300_000,
          }
        )
      );
    });
  });

  test('Configure a REST outcome', async ({ triggerApp: app, sysAdminActor, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-891',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const triggerWithRestOutcome = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      status: true,
      ruleSet: new SimpleRuleLogic({
        rules: [],
      }),
      outcomes: [
        new RestApiOutcome({
          status: true,
          restURL: 'https://jsonplaceholder.typicode.com/posts/{:Record Id}',
          authorization: 'No Authorization Required',
          dataMappings: {
            id: textField.name,
          },
          notificationUsers: [sysAdminUser.fullName],
        }),
      ],
    });

    await test.step("Navigate to the app's layout tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
    });

    await test.step('Create a text field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(textField));
    });

    await test.step('Add the text field to the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: textField.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with REST outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(triggerWithRestOutcome));
    });

    let recordId: number;

    await test.step('Create a record in the app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Verify the REST outcome is triggered', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.browse().reload();
            const section = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
            await actor
              .browse()
              .check(ContentRecordTargets.textFieldInSection(section, textField.name))
              .hasValue(recordId.toString(), { timeout: 5_000 });
          },
          {
            intervals: [5_000],
            timeout: 300_000,
          }
        )
      );
    });
  });
});
