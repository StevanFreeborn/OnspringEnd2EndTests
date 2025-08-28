import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditEmailSendingDomainPage } from '../../pageObjectModels/emailSendingDomain/editEmailSendingDomainPage';
import { AnnotationType } from '../annotations';

type EmailSendingDomainTestFixtures = {
  adminHomePage: AdminHomePage;
  editEmailSendingDomainPage: EditEmailSendingDomainPage;
};

const test = base.extend<EmailSendingDomainTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editEmailSendingDomainPage: async ({ sysAdminPage }, use) => await use(new EditEmailSendingDomainPage(sysAdminPage)),
});

test.describe('email sending domain', () => {
  test('Create an Email Sending Domain via the create button on the header of the admin home page', async ({
    adminHomePage,
    editEmailSendingDomainPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-367',
    });

    const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create an email sending domain', async () => {
      await adminHomePage.createEmailSendingDomainUsingHeaderCreateButton(emailSendingDomain);
      await adminHomePage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
    });

    await test.step('Verify the email sending domain was created', async () => {
      await expect(editEmailSendingDomainPage.name()).toHaveText(emailSendingDomain);
    });
  });

  test('Create an Email Sending Domain via the create button on the Instance tile on the admin home page', async ({
    adminHomePage,
    editEmailSendingDomainPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-368',
    });

    const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create an email sending domain', async () => {
      await adminHomePage.createEmailSendingDomainUsingInstanceTileCreateButton(emailSendingDomain);
      await adminHomePage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
    });

    await test.step('Verify the email sending domain was created', async () => {
      await expect(editEmailSendingDomainPage.name()).toHaveText(emailSendingDomain);
    });
  });

  test('Create an Email Sending Domain via the "Create Email Sending Domain" button on the email sending domain home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-369',
    });

    expect(true).toBe(true);
  });

  test('Setup an verify an email sending domain', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-370',
    });

    expect(true).toBe(true);
  });

  test('Delete a custom email sending domain', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-371',
    });

    expect(true).toBe(true);
  });
});
