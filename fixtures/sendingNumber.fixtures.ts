import { FakeDataFactory, SendingNumber } from '@stevanfreeborn/onspring-models';
import { SendingNumberQuestions, SendingNumberTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class SendingNumberFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (sendingNumber: SendingNumber) => Promise<void>
    ) => {
      const sendingNumber = new SendingNumber({
        name: this.name ?? FakeDataFactory.createFakeSendingNumberName(),
      });

      await sysAdminActor.attemptsTo(SendingNumberTasks.gotoAddPage(), SendingNumberTasks.fillAddForm(sendingNumber));
      sendingNumber.smsSendingNumber = await sysAdminActor.asks(SendingNumberQuestions.selectedNumber());
      await sysAdminActor.attemptsTo(SendingNumberTasks.saveNew());
      sendingNumber.id = await sysAdminActor.asks(SendingNumberQuestions.currentId());

      try {
        await use(sendingNumber);
      } finally {
        await sysAdminActor.attemptsTo(SendingNumberTasks.deleteSendingNumbers([sendingNumber.name]));
      }
    };
  }
}

export class SendingNumberFixture {
  static create(): SendingNumberFixtureBuilder {
    return new SendingNumberFixtureBuilder();
  }
}

export const sendingNumber = SendingNumberFixture.create().build();
