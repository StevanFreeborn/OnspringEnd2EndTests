import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { EmailBodyTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class EmailBodyFixtureBuilder {
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
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (emailBodyName: string) => Promise<void>) => {
      if (!this.appName) {
        throw new Error('EmailBodyFixture requires an appName. Use .forApp(appName).');
      }
      const emailBodyName = this.name ?? FakeDataFactory.createFakeEmailBodyName();
      await sysAdminActor.attemptsTo(
        EmailBodyTasks.goto(),
        EmailBodyTasks.createFromAdminPage(this.appName, emailBodyName)
      );

      try {
        await use(emailBodyName);
      } finally {
        await sysAdminActor.attemptsTo(EmailBodyTasks.goto(), EmailBodyTasks.deleteFromAdminPage(emailBodyName));
      }
    };
  }
}

export class EmailBodyFixture {
  static create(): EmailBodyFixtureBuilder {
    return new EmailBodyFixtureBuilder();
  }
}
