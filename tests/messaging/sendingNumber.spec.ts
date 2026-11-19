import { FakeDataFactory, SendingNumber } from '@stevanfreeborn/onspring-models';
import {
  EditSendingNumberPageTargets,
  SendingNumberAdminPageTargets,
  SendingNumberTasks,
} from '@stevanfreeborn/onspring-ui';
import { SendingNumberFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type SendingNumberTestFixtures = {
  sendingNumber: SendingNumber;
};

const test = base.extend<SendingNumberTestFixtures>({
  sendingNumber: SendingNumberFixture.create().build(),
});

test.describe(
  'sms sending number',
  {
    tag: [Tags.NotFedRAMP],
  },
  () => {
    let sendingNumbersToDelete: string[] = [];

    test.beforeEach(({ environment }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(environment.isFedspring(), 'This feature is not applicable to the FEDSPRING environment');
    });

    test.afterEach(async ({ sysAdminActor }) => {
      await sysAdminActor.attemptsTo(SendingNumberTasks.deleteSendingNumbers(sendingNumbersToDelete));
      sendingNumbersToDelete = [];
    });

    test('Create a new custom SMS Sending Number', async ({ sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-444',
      });

      const sendingNumber = new SendingNumber({
        name: FakeDataFactory.createFakeSendingNumberName(),
      });

      sendingNumbersToDelete.push(sendingNumber.name);

      await test.step('Navigate to admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create a new sending number', async () => {
        await sysAdminActor.attemptsTo(SendingNumberTasks.createViaHeader(sendingNumber));
        await sysAdminActor.browse().checkPage().hasUrl(EditSendingNumberPageTargets.pathRegex);
      });

      await test.step('Verify the sending number is created', async () => {
        await sysAdminActor.browse().check(EditSendingNumberPageTargets.nameInput).hasValue(sendingNumber.name);
      });
    });

    test('Delete an SMS Sending Number', async ({ sendingNumber, sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-446',
      });

      await test.step('Navigate to sending number admin page', async () => {
        await sysAdminActor.attemptsTo(SendingNumberTasks.gotoAdminPage());
      });

      await test.step('Delete the sending number', async () => {
        await sysAdminActor.attemptsTo(SendingNumberTasks.deleteFromAdminPage(sendingNumber.name));
      });

      await test.step('Verify the sending number is deleted', async () => {
        await sysAdminActor.browse().check(SendingNumberAdminPageTargets.rowByName(sendingNumber.name)).isNotAttached();
      });
    });
  }
);
