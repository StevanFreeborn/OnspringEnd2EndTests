import { EmailTemplate, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  EditEmailTemplatePageTargets,
  EmailTemplatesPageTargets,
  EmailTemplateTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('email template', () => {
  let emailTemplatesToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(EmailTemplateTasks.deleteTemplates(emailTemplatesToDelete));
    emailTemplatesToDelete = [];
  });

  test('Create an Email Template via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-380',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email template', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.createViaHeader(emailTemplateName));
    });

    await test.step('Verify the email template is created', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateName);
    });
  });

  test('Create an Email Template via the create button on the Messaging tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-381',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email template using the Messaging tile', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.createViaTile(emailTemplateName));
    });

    await test.step('Verify the email template is created', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateName);
    });
  });

  test('Create an Email Template via the "Create Email Template" button on the email template home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-382',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);

    await test.step('Navigate to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Create the email template', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.create(emailTemplateName));
    });

    await test.step('Verify the email template is created', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateName);
    });
  });

  test('Create a copy of an Email Template via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-383',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);
    emailTemplatesToDelete.push(emailTemplateCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email template to copy', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.createViaHeader(emailTemplateName));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a copy of the email template', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.copyViaHeader(emailTemplateName, emailTemplateCopyName));
    });

    await test.step('Verify the email template is copied', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateCopyName);
    });
  });

  test('Create a copy of an Email Template via the create button on the Messaging tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-384',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);
    emailTemplatesToDelete.push(emailTemplateCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the email template to copy', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.createViaTile(emailTemplateName));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a copy of the email template using the Messaging tile', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.copyViaTile(emailTemplateName, emailTemplateCopyName));
    });

    await test.step('Verify the email template is copied', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateCopyName);
    });
  });

  test('Create a copy of an Email Template via the "Create Email Template" button on the email templates home page.', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-385',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const emailTemplateCopyName = FakeDataFactory.createFakeEmailTemplateName();
    emailTemplatesToDelete.push(emailTemplateName);
    emailTemplatesToDelete.push(emailTemplateCopyName);

    await test.step('Navigate to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Create the email template to copy', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.create(emailTemplateName));
    });

    await test.step('Navigate back to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Create a copy of the email template', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.copy(emailTemplateName, emailTemplateCopyName));
    });

    await test.step('Verify the email template is copied', async () => {
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(emailTemplateCopyName);
    });
  });

  test('Update an email template', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-386',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();
    const updatedName = `${emailTemplateName} Updated`;
    emailTemplatesToDelete.push(updatedName);

    await test.step('Navigate to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Create an email template to update', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.create(emailTemplateName));
    });

    await test.step('Update the email template', async () => {
      await sysAdminActor.attemptsTo(
        EmailTemplateTasks.update(
          new EmailTemplate({
            name: updatedName,
          })
        )
      );
    });

    await test.step('Verify the email template is updated', async () => {
      await sysAdminActor.browse().reload();
      await sysAdminActor.browse().check(EditEmailTemplatePageTargets.nameInput).hasValue(updatedName);
    });
  });

  test('Delete an email template', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-387',
    });

    const emailTemplateName = FakeDataFactory.createFakeEmailTemplateName();

    await test.step('Navigate to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Create an email template to delete', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.create(emailTemplateName));
    });

    await test.step('Navigate back to the email template admin page', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.goto());
    });

    await test.step('Delete the email template', async () => {
      await sysAdminActor.attemptsTo(EmailTemplateTasks.deleteTemplates([emailTemplateName]));
    });

    await test.step('Verify the email template is deleted', async () => {
      const row = EmailTemplatesPageTargets.rowByName(emailTemplateName);
      await sysAdminActor.browse().check(row).isHidden();
    });
  });
});
