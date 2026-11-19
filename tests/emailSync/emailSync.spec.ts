import { App, EmailSync, FakeDataFactory, TextField } from '@stevanfreeborn/onspring-models';
import { AppTasks, EditEmailSyncPageTargets, EmailSyncPageTargets, EmailSyncTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type EmailSyncTestFixtures = {
  app: App;
};

const test = base.extend<EmailSyncTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('email sync', () => {
  let emailSyncsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(EmailSyncTasks.goto(), EmailSyncTasks.deleteEmailSyncs(emailSyncsToDelete));
    emailSyncsToDelete = [];
  });

  test('Create an Email Sync via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-372',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createViaHeader(emailSyncName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Verify the email sync was created successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncName);
    });
  });

  test('Create an Email Sync via the create button on the Integrations tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-373',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createViaTile(emailSyncName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Verify the email sync was created successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncName);
    });
  });

  test('Create an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-374',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncName);

    await test.step('Navigate to the email sync admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Create the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.create(emailSyncName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('verify the email was created successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncName);
    });
  });

  test('Create a copy of an Email Sync via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-375',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync to copy', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createViaHeader(emailSyncToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync copy', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createCopyViaHeader(emailSyncToCopyName, emailSyncCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Verify the email sync copy was created successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncCopyName);
    });
  });

  test('Create a copy of an Email Sync via the create button on the Integrations tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-376',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync to copy', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createViaTile(emailSyncToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email sync copy', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createCopyViaTile(emailSyncToCopyName, emailSyncCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Verify the email sync copy was created successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncCopyName);
    });
  });

  test('Create a copy of an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-377',
    });

    const emailSyncToCopyName = FakeDataFactory.createFakeEmailSyncName();
    const emailSyncCopyName = FakeDataFactory.createFakeEmailSyncName();
    emailSyncsToDelete.push(emailSyncToCopyName, emailSyncCopyName);

    await test.step('Navigate to the email syncs admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Create the email sync to copy', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.create(emailSyncToCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Navigate back to the email syncs admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Create a copy of the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.createCopy(emailSyncToCopyName, emailSyncCopyName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Verify the email sync was copied successfully', async () => {
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.nameInput).hasValue(emailSyncCopyName);
    });
  });

  test('Update an Email Sync', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-378',
    });

    const textField = new TextField({ name: FakeDataFactory.createFakeFieldName() });

    const emailSync = new EmailSync({
      name: FakeDataFactory.createFakeEmailSyncName(),
      status: true,
      appOrSurvey: app.name,
      emailKey: FakeDataFactory.createFakeEmailSyncKey(),
      dataMapping: { Subject: textField.name },
    });
    emailSyncsToDelete.push(emailSync.name);

    await test.step('Add text field for use in data mapping', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.addTextField(textField.name));
    });

    await test.step('Navigate to the email syncs admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Create the email sync to update', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.create(emailSync.name));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Update the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.update(emailSync), EmailSyncTasks.save());
    });

    await test.step('Verify the email sync was updated', async () => {
      await sysAdminActor.browse().reload();
      await sysAdminActor.browse().check(EditEmailSyncPageTargets.dataSyncTab.emailKeyInput).isDisabled();
      await sysAdminActor
        .browse()
        .check(EditEmailSyncPageTargets.dataSyncTab.emailKeyInput)
        .hasValue(emailSync.emailKey);
    });
  });

  test('Delete an Email Sync', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-379',
    });

    const emailSyncName = FakeDataFactory.createFakeEmailSyncName();

    await test.step('Navigate to the email syncs admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Create the email sync to be deleted', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.create(emailSyncName));
      await sysAdminActor.browse().checkPage().hasUrl(EditEmailSyncPageTargets.pathRegex);
    });

    await test.step('Navigate back to the email syncs admin page', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.goto());
    });

    await test.step('Delete the email sync', async () => {
      await sysAdminActor.attemptsTo(EmailSyncTasks.deleteEmailSync(emailSyncName));
    });

    await test.step('Verify the email sync was deleted', async () => {
      await sysAdminActor.browse().check(EmailSyncPageTargets.rowByName(emailSyncName)).isNotAttached();
    });
  });
});
