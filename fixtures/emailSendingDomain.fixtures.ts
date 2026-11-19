import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { EmailSendingDomainTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class EmailSendingDomainFixtureBuilder {
  private domain?: string;

  withDomain(domain: string): this {
    this.domain = domain;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (domain: string) => Promise<void>
    ) => {
      const emailDomain = this.domain ?? FakeDataFactory.createFakeCustomEmailSendingDomain();
      await sysAdminActor.attemptsTo(EmailSendingDomainTasks.create(emailDomain));

      try {
        await use(emailDomain);
      } finally {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.deleteEmailSendingDomains([emailDomain]));
      }
    };
  }
}

export class EmailSendingDomainFixture {
  static create(): EmailSendingDomainFixtureBuilder {
    return new EmailSendingDomainFixtureBuilder();
  }
}

export const emailSendingDomain = EmailSendingDomainFixture.create().build();
