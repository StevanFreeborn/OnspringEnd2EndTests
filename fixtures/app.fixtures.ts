import { Page } from '@playwright/test';
import { App, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { AppTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';

export async function appAdminPage({ sysAdminPage }: { sysAdminPage: Page }, use: (r: AppAdminPage) => Promise<void>) {
  const appAdminPage = new AppAdminPage(sysAdminPage);
  await use(appAdminPage);
}

export class AppFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (r: App) => Promise<void>
    ) => {
      const appName = this.name ?? FakeDataFactory.createFakeAppName();
      const app = await createAppWithActor(sysAdminActor, appName);

      await use(app);

      await sysAdminActor.attemptsTo(AppTasks.deleteApps([app.name]));
    };
  }
}

export class AppFixture {
  static create(): AppFixtureBuilder {
    return new AppFixtureBuilder();
  }
}

export const app = AppFixture.create().build();

export async function createAppWithActor(
  actor: WebActor,
  appName: string = FakeDataFactory.createFakeAppName()
): Promise<App> {
  await actor.attemptsTo(AppTasks.create(appName));
  const url = actor.browse().url();
  const urlParts = url.split('/');
  const appId = parseInt(urlParts[urlParts.length - 1]);
  return new App({ id: appId, name: appName });
}

export async function createApp(sysAdminPage: Page, appName: string = FakeDataFactory.createFakeAppName()) {
  const actor = WebActor.using('SysAdmin', sysAdminPage);
  return createAppWithActor(actor, appName);
}
