import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { SendingNumber } from '../../models/sendingNumber';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddSendingNumberPage } from '../../pageObjectModels/messaging/addSendingNumberPage';
import { EditSendingNumberPage } from '../../pageObjectModels/messaging/editSendingNumberPage';
import { AnnotationType } from '../annotations';
import { SendingNumberAdminPage } from './../../pageObjectModels/messaging/sendingNumberAdminPage';

type SendingNumberTestFixtures = {
  adminHomePage: AdminHomePage;
  addSendingNumberPage: AddSendingNumberPage;
  editSendingNumberPage: EditSendingNumberPage;
  sendingNumberAdminPage: SendingNumberAdminPage;
};

const test = base.extend<SendingNumberTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  addSendingNumberPage: async ({ sysAdminPage }, use) => await use(new AddSendingNumberPage(sysAdminPage)),
  editSendingNumberPage: async ({ sysAdminPage }, use) => await use(new EditSendingNumberPage(sysAdminPage)),
  sendingNumberAdminPage: async ({ sysAdminPage }, use) => await use(new SendingNumberAdminPage(sysAdminPage)),
});

test.describe('sms sending number', () => {
  let sendingNumbersToDelete: string[] = [];

  test.afterEach(async ({ sendingNumberAdminPage }) => {
    await sendingNumberAdminPage.deleteSendingNumbers(sendingNumbersToDelete);
    sendingNumbersToDelete = [];
  });

  test('Create a new custom SMS Sending Number', async ({
    adminHomePage,
    addSendingNumberPage,
    editSendingNumberPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-444',
    });

    const sendingNumber = new SendingNumber({
      name: FakeDataFactory.createFakeSendingNumberName(),
    });

    sendingNumbersToDelete.push(sendingNumber.name);

    await test.step('Navigate to admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a new sending number', async () => {
      await createSendingNumber({
        adminHomePage,
        addSendingNumberPage,
        editSendingNumberPage,
        sendingNumber,
      });
    });

    await test.step('Verify the sending number is created', async () => {
      await expect(editSendingNumberPage.nameInput).toHaveValue(sendingNumber.name);
    });
  });

  test('Delete an SMS Sending Number', async ({
    sendingNumberAdminPage,
    adminHomePage,
    addSendingNumberPage,
    editSendingNumberPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-446',
    });

    const sendingNumber = new SendingNumber({
      name: FakeDataFactory.createFakeSendingNumberName(),
    });

    const sendingNumberRow = sendingNumberAdminPage.sendingNumberGrid.getByRole('row', {
      name: sendingNumber.name,
    });

    await test.step('Navigate to admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the sending number to delete', async () => {
      await createSendingNumber({
        adminHomePage,
        addSendingNumberPage,
        editSendingNumberPage,
        sendingNumber,
      });
    });

    await test.step('Navigate to sending number admin page', async () => {
      await sendingNumberAdminPage.goto();
    });

    await test.step('Delete the sending number', async () => {
      await sendingNumberRow.hover();
      await sendingNumberRow.getByTitle('Delete SMS Sending Number').click();

      try {
        await sendingNumberAdminPage.deleteNumberDialog.numberSelector.click({ timeout: 2000 });
        await sendingNumberAdminPage.deleteNumberDialog.numberSelector.page().getByRole('option').first().click();
        // eslint-disable-next-line no-empty
      } catch (error) {}

      await sendingNumberAdminPage.deleteNumberDialog.okInput.pressSequentially('OK', { delay: 150 });
      await sendingNumberAdminPage.deleteNumberDialog.deleteButton.click();
      await sendingNumberAdminPage.deleteNumberDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the sending number is deleted', async () => {
      await expect(sendingNumberRow).not.toBeAttached();
    });
  });
});

async function createSendingNumber({
  adminHomePage,
  addSendingNumberPage,
  editSendingNumberPage,
  sendingNumber,
}: {
  adminHomePage: AdminHomePage;
  addSendingNumberPage: AddSendingNumberPage;
  editSendingNumberPage: EditSendingNumberPage;
  sendingNumber: SendingNumber;
}) {
  await adminHomePage.adminNav.adminCreateButton.hover();
  await adminHomePage.adminNav.sendingNumberCreateMenuOption.click();
  await adminHomePage.page.waitForURL(addSendingNumberPage.path);

  await addSendingNumberPage.fillOutForm(sendingNumber);
  await addSendingNumberPage.saveButton.click();
  await addSendingNumberPage.page.waitForURL(editSendingNumberPage.pathRegex);
}
