import fs from 'fs';
import {
  App,
  DateField,
  FakeDataFactory,
  LayoutItem,
  ListField,
  ListValue,
  NumberField,
  TextField,
  TimeSpanField,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentTasks,
  DataImportsPageTargets,
  DataImportTasks,
  EditDataImportPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base, expect } from '../../fixtures';
import { writeCsvFile } from '../../fixtures/file.fixtures';
import { AnnotationType } from '../annotations';

type DataImportTestFixtures = {
  targetApp: App;
};

const test = base.extend<DataImportTestFixtures>({
  targetApp: AppFixture.create().build(),
});

test.describe('data import', () => {
  let dataImportsToDelete: string[] = [];
  let importFilesToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataImportTasks.deleteDataImports(dataImportsToDelete));

    for (const importFilePath of importFilesToDelete) {
      if (fs.existsSync(importFilePath) === false) {
        continue;
      }

      fs.rmSync(importFilePath);
    }

    dataImportsToDelete = [];
    importFilesToDelete = [];
  });

  test('Create a Data Import via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-335',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportName);
    });
  });

  test('Create a Data Import via the create button on the Integrations tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-336',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaTile(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportName);
    });
  });

  test('Create a Data Import via the "Create Import Configuration" button on the data import home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-337',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    await test.step('Navigate to the data import home page', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.goto());
    });

    await test.step('Create the data import', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.create(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportName);
    });
  });

  test('Create a copy of a Data Import via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-338',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import to copy', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
      await sysAdminActor.attemptsTo(DataImportTasks.createCopyViaHeader(dataImportToCopyName, dataImportCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportCopyName);
    });
  });

  test('Create a copy of a Data Import via the create button on the Integrations tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-339',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import to copy', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
      await sysAdminActor.attemptsTo(DataImportTasks.createCopyViaTile(dataImportToCopyName, dataImportCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportCopyName);
    });
  });

  test('Create a copy of a Data Import via the "Create Import Configuration" button on the data import home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-340',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the data import home page', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.goto());
    });

    await test.step('Create the data import to copy', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.create(dataImportToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await sysAdminActor.attemptsTo(
        DataImportTasks.goto(),
        DataImportTasks.createCopy(dataImportToCopyName, dataImportCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.dataFileTab.nameInput).hasValue(dataImportCopyName);
    });
  });

  test('Update a Data Import', async ({ sysAdminActor, targetApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-342',
    });

    const textField = new TextField({ name: 'Text Field' });

    const dataToImport = [
      {
        [textField.name]: 'Text Field Value',
      },
    ];

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    const updatedDataImportName = `${dataImportName} (Updated)`;
    dataImportsToDelete.push(updatedDataImportName);

    let importFilePath: string;

    await test.step('Create the fields to import data into', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Create the import file to be imported', () => {
      importFilePath = writeCsvFile(dataToImport);
      importFilesToDelete.push(importFilePath);
    });

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import to be updated', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Update the data import', async () => {
      const regex = new RegExp(textField.name, 'i');

      await sysAdminActor.attemptsTo(
        DataImportTasks.updateName(updatedDataImportName),
        DataImportTasks.selectTargetApp(targetApp.name),
        DataImportTasks.uploadImportFile(importFilePath),
        DataImportTasks.openDataMappingTab()
      );

      await sysAdminActor
        .browse()
        .check(EditDataImportPageTargets.dataMappingTab.appFieldByName(textField.name))
        .hasText(regex);
      await sysAdminActor
        .browse()
        .check(EditDataImportPageTargets.dataMappingTab.mappedFieldByName(textField.name))
        .hasText(regex);

      await sysAdminActor.attemptsTo(DataImportTasks.save());
    });

    await test.step('Verify the data import was updated', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.goto(), DataImportTasks.scrollAllIntoView());
      await sysAdminActor.browse().check(DataImportsPageTargets.rowByName(updatedDataImportName)).isVisible();
    });
  });

  test('Delete a Data Import', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-343',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import to be deleted', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Delete the data import', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.goto(), DataImportTasks.delete(dataImportName));
    });

    await test.step('Verify the data import was deleted', async () => {
      await sysAdminActor.browse().check(DataImportsPageTargets.rowByName(dataImportName)).isHidden();
    });
  });

  test('Run a Data Import', async ({ sysAdminActor, targetApp, sysAdminEmail }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-341',
    });

    const today = new Date();

    const importData = [
      {
        field: new TextField({ name: 'Text Field' }),
        value: 'Text Field Value',
      },
      {
        field: new DateField({ name: 'Date Field' }),
        value: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
      },
      {
        field: new NumberField({ name: 'Number Field' }),
        value: '123',
      },
      {
        field: new ListField({
          name: 'List Field',
          values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
        }),
        value: 'Yes',
      },
      {
        field: new TimeSpanField({ name: 'Timespan Field' }),
        value: '1 Second(s)',
      },
    ] as { field: LayoutItem; value: string }[];

    const fields = importData.map(data => data.field);

    const recordToImport = importData.reduce(
      (acc, data) => {
        acc[data.field.name] = data.value;
        return acc;
      },
      {} as Record<string, string>
    );

    const dataToImport = [recordToImport];

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    let importFilePath: string;

    await test.step('Create the fields to import data into', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(targetApp.id), AppTasks.openLayoutDesigner());

      for (const [i, field] of fields.entries()) {
        await sysAdminActor.attemptsTo(
          AppTasks.addLayoutItemInLayoutDesigner(field),
          AppTasks.dragFieldOntoLayout({
            tabName: 'Tab 2',
            sectionName: 'Section 1',
            column: 0,
            row: i,
            fieldName: field.name,
          }),
          AppTasks.saveLayout()
        );
      }

      await sysAdminActor.attemptsTo(AppTasks.closeLayout());
    });

    await test.step('Create the import file to be imported', () => {
      importFilePath = writeCsvFile(dataToImport);
      importFilesToDelete.push(importFilePath);
    });

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the data import to be updated', async () => {
      await sysAdminActor.attemptsTo(DataImportTasks.createViaHeader(dataImportName));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataImportPageTargets.pathRegex);
    });

    await test.step('Run the data import', async () => {
      await sysAdminActor.attemptsTo(
        DataImportTasks.selectTargetApp(targetApp.name),
        DataImportTasks.uploadImportFile(importFilePath),
        DataImportTasks.openDataMappingTab()
      );

      const mappedFields = importData.map(data => data.field.name);

      for (const field of mappedFields) {
        const regex = new RegExp(field, 'i');
        await sysAdminActor
          .browse()
          .check(EditDataImportPageTargets.dataMappingTab.appFieldByName(field))
          .hasText(regex);
        await sysAdminActor
          .browse()
          .check(EditDataImportPageTargets.dataMappingTab.mappedFieldByName(field))
          .hasText(regex);
      }

      await sysAdminActor.attemptsTo(DataImportTasks.saveAndRun());
    });

    await test.step('Verify the data import was run', async () => {
      await sysAdminActor.browse().check(EditDataImportPageTargets.importProcessingMessage).isVisible();

      await expect(async () => {
        const searchCriteria = [['TEXT', dataImportName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();
        expect(email.subject).toBe('Onspring Data Import Complete');

        if (email.html !== false) {
          // eslint-disable-next-line playwright/no-conditional-expect
          expect(email.html).toContain('New Content Created: 1');
        }
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });

      await sysAdminActor.attemptsTo(ContentTasks.gotoView(targetApp.id, 1));

      for (const { field, value } of importData) {
        await sysAdminActor.attemptsTo(
          ContentTasks.checkReadOnlyFieldText({
            tabName: 'Tab 2',
            sectionName: 'Section 1',
            fieldName: field.name,
            expectedText: value,
          })
        );
      }
    });
  });
});
