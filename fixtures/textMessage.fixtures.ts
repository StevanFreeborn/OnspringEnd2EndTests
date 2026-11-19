import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { TextMessageTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class TextMessageFixtureBuilder {
  private name?: string;
  private appName?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  forApp(appName: string): this {
    this.appName = appName;
    return this;
  }

  build() {
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (textMessageName: string) => Promise<void>) => {
      if (!this.appName) {
        throw new Error('TextMessageFixture requires an appName. Use .forApp(appName).');
      }
      const textMessageName = this.name ?? FakeDataFactory.createFakeTextMessageName();
      await sysAdminActor.attemptsTo(
        TextMessageTasks.goto(),
        TextMessageTasks.createFromAdminPage(this.appName, textMessageName)
      );

      try {
        await use(textMessageName);
      } finally {
        await sysAdminActor.attemptsTo(TextMessageTasks.goto(), TextMessageTasks.deleteFromAdminPage(textMessageName));
      }
    };
  }
}

export class TextMessageFixture {
  static create(): TextMessageFixtureBuilder {
    return new TextMessageFixtureBuilder();
  }
}
