import { App, FakeDataFactory, SecureFileDataConnector, TextField } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentTasks,
  DataConnectorsPageTargets,
  DataConnectorTasks,
  EditDataConnectorPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base, expect } from '../../fixtures';
import { writeCsvFile } from '../../fixtures/file.fixtures';
import { AnnotationType } from '../annotations';

type SecureFileDataConnectorTestFixtures = {
  app: App;
};

const test = base.extend<SecureFileDataConnectorTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('secure file data connector', () => {
  let connectorsToDelete: string[] = [];
  let sftpFilesToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor, sftpService }) => {
    await sysAdminActor.attemptsTo(DataConnectorTasks.deleteConnectors(connectorsToDelete));
    connectorsToDelete = [];

    for (const filePath of sftpFilesToDelete) {
      await sftpService.deleteFile(filePath);
    }

    sftpFilesToDelete = [];
  });

  test('Create a new Secure File connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-430',
    });

    const dataConnectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(dataConnectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create a new secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(dataConnectorName, 'Secure File Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the secure file connector is created successfully', async () => {
      await sysAdminActor
        .browse()
        .check(EditDataConnectorPageTargets.connectionTab.nameInput)
        .hasValue(dataConnectorName);
    });
  });

  test('Create a copy of a Secure File connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-431',
    });

    const connectorToCopy = FakeDataFactory.createFakeDataConnectorName();
    const dataConnectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorToCopy, dataConnectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the secure file connector to copy', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorToCopy, 'Secure File Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Copy the secure file connector', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.createCopy('Secure File Data Connector', connectorToCopy, dataConnectorName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the secure file connector copy is created successfully', async () => {
      await sysAdminActor
        .browse()
        .check(EditDataConnectorPageTargets.connectionTab.nameInput)
        .hasValue(dataConnectorName);
    });
  });

  test('Delete a Secure File connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-432',
    });

    const dataConnectorName = FakeDataFactory.createFakeDataConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the secure file connector to delete', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(dataConnectorName, 'Secure File Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Delete the secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.delete(dataConnectorName));
    });

    await test.step('Verify the secure file connector is deleted successfully', async () => {
      await sysAdminActor.browse().check(DataConnectorsPageTargets.rowByName(dataConnectorName)).isHidden();
    });
  });

  test('Configure a new Secure File connector', async ({ app, sysAdminActor, sftpService, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-433',
    });

    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const dataConnector = new SecureFileDataConnector({
      name: FakeDataFactory.createFakeDataConnectorName(),
      status: true,
      app: app.name,
      hostname: sftpService.hostname(),
      port: sftpService.port(),
      fileLocation: './',
      fileName: `${FakeDataFactory.createUniqueIdentifier()}.csv`,
      fileType: 'CSV (Comma delimited)',
      authType: {
        type: 'Username / Password',
        username: sftpService.username(),
        password: sftpService.password(),
      },
      startingOnDate: new Date(Date.now() + 10 * 60_000),
      frequency: 'Every Day',
      notificationUsers: [sysAdminUser.fullName],
      fieldMapping: [{ [textField.name]: textField.name }],
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
    });

    await test.step('Add text field for field mappings', async () => {
      await sysAdminActor.attemptsTo(AppTasks.addTextField(textField.name));
    });

    await test.step('Upload csv to be imported', async () => {
      const sourcePath = writeCsvFile([{ [textField.name]: 'Text Field Value' }]);
      await sftpService.uploadFile(sourcePath, dataConnector.filePath());
      sftpFilesToDelete.push(dataConnector.filePath());
    });

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create a new secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(dataConnector.name, 'Secure File Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Configure the secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.configureSecureFile(dataConnector));
    });

    await test.step('Verify the secure file connector is configured successfully', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto(), DataConnectorTasks.scrollAllIntoView());

      const dataConnectorRow = DataConnectorsPageTargets.rowByName(new RegExp(dataConnector.name));
      await sysAdminActor.browse().check(dataConnectorRow).isVisible();
      await sysAdminActor
        .browse()
        .check(dataConnectorRow)
        .hasText(/enabled/i);
    });

    await test.step('Remove the uploaded file from SFTP server', async () => {
      const filePath = dataConnector.filePath();
      await sftpService.deleteFile(filePath);
      sftpFilesToDelete = sftpFilesToDelete.filter(path => path !== filePath);
    });
  });

  test('Verify a new Secure File connector runs successfully', async ({
    app,
    sysAdminActor,
    sftpService,
    sysAdminUser,
    sysAdminEmail,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-434',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textFieldValue = 'Text Field Value';
    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const dataConnector = new SecureFileDataConnector({
      name: FakeDataFactory.createFakeDataConnectorName(),
      status: true,
      app: app.name,
      hostname: sftpService.hostname(),
      port: sftpService.port(),
      fileLocation: './',
      fileName: `${FakeDataFactory.createUniqueIdentifier()}.csv`,
      fileType: 'CSV (Comma delimited)',
      authType: {
        type: 'Username / Password',
        username: sftpService.username(),
        password: sftpService.password(),
      },
      startingOnDate: new Date(Date.now() + 2 * 60_000),
      frequency: 'Every Day',
      notificationUsers: [sysAdminUser.fullName],
      fieldMapping: [{ [textField.name]: textField.name }],
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to app admin page', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id));
    });

    await test.step('Add text field for field mappings', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addTextFieldInLayoutDesigner(textField.name),
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

    await test.step('Upload csv to be imported', async () => {
      const sourcePath = writeCsvFile([{ [textField.name]: 'Text Field Value' }]);
      await sftpService.uploadFile(sourcePath, dataConnector.filePath());
      sftpFilesToDelete.push(dataConnector.filePath());
    });

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create a new secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(dataConnector.name, 'Secure File Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Configure the secure file connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.configureSecureFile(dataConnector));
    });

    await test.step('Verify the secure file connector is run', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', dataConnector.name]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();
        expect(email.subject).toBe('Onspring Data Connector Complete');
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });

      await sysAdminActor.attemptsTo(
        ContentTasks.gotoView(app.id, 1),
        ContentTasks.checkReadOnlyFieldText({
          tabName,
          sectionName,
          fieldName: textField.name,
          expectedText: textFieldValue,
        })
      );
    });

    await test.step('Remove the uploaded file from SFTP server', async () => {
      const filePath = dataConnector.filePath();
      await sftpService.deleteFile(filePath);
      sftpFilesToDelete = sftpFilesToDelete.filter(path => path !== filePath);
    });
  });
});
