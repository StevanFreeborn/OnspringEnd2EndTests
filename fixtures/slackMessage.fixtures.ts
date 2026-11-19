import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { SlackMessageTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class SlackMessageFixtureBuilder {
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
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (slackMessageName: string) => Promise<void>) => {
      if (!this.appName) {
        throw new Error('SlackMessageFixture requires an appName. Use .forApp(appName).');
      }
      const slackMessageName = this.name ?? FakeDataFactory.createFakeSlackMessageName();
      await sysAdminActor.attemptsTo(
        SlackMessageTasks.goto(),
        SlackMessageTasks.createFromAdminPage(this.appName, slackMessageName)
      );

      try {
        await use(slackMessageName);
      } finally {
        await sysAdminActor.attemptsTo(
          SlackMessageTasks.goto(),
          SlackMessageTasks.deleteFromAdminPage(slackMessageName)
        );
      }
    };
  }
}

export class SlackMessageFixture {
  static create(): SlackMessageFixtureBuilder {
    return new SlackMessageFixtureBuilder();
  }
}
