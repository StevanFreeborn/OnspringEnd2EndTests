import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { EmailSyncTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class EmailSyncFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (emailSyncName: string) => Promise<void>
    ) => {
      const emailSyncName = this.name ?? FakeDataFactory.createFakeEmailSyncName();
      await sysAdminActor.attemptsTo(
        EmailSyncTasks.goto(),
        EmailSyncTasks.create(emailSyncName)
      );

      try {
        await use(emailSyncName);
      } finally {
        await sysAdminActor.attemptsTo(
          EmailSyncTasks.goto(),
          EmailSyncTasks.deleteEmailSync(emailSyncName)
        );
      }
    };
  }
}

export class EmailSyncFixture {
  static create(): EmailSyncFixtureBuilder {
    return new EmailSyncFixtureBuilder();
  }
}

export const emailSync = EmailSyncFixture.create().build();
