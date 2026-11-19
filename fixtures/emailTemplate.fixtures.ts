import { EmailTemplate, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { EmailTemplateTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class EmailTemplateFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (template: EmailTemplate) => Promise<void>
    ) => {
      const templateName = this.name ?? FakeDataFactory.createFakeEmailTemplateName();
      await sysAdminActor.attemptsTo(EmailTemplateTasks.create(templateName));
      const template = new EmailTemplate({ name: templateName });

      try {
        await use(template);
      } finally {
        await sysAdminActor.attemptsTo(EmailTemplateTasks.deleteTemplates([templateName]));
      }
    };
  }
}

export class EmailTemplateFixture {
  static create(): EmailTemplateFixtureBuilder {
    return new EmailTemplateFixtureBuilder();
  }
}

export const emailTemplate = EmailTemplateFixture.create().build();
