import { App, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { DynamicDocumentTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class DynamicDocumentFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private name?: string;
  private appName?: string;
  private appNameFactory?: (deps: { app: App }) => string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  forApp(appName: string): this;
  forApp(factory: (deps: { app: App }) => string): DynamicDocumentFixtureBuilder<TDeps & { app: App }>;
  forApp(
    appNameOrFactory: string | ((deps: { app: App }) => string)
  ): this | DynamicDocumentFixtureBuilder<TDeps & { app: App }> {
    if (typeof appNameOrFactory === 'string') {
      this.appName = appNameOrFactory;
      return this;
    }

    this.appNameFactory = appNameOrFactory;
    return this as unknown as DynamicDocumentFixtureBuilder<TDeps & { app: App }>;
  }

  private async runFixture(
    sysAdminActor: WebActor,
    appName: string,
    use: (documentName: string) => Promise<void>
  ): Promise<void> {
    const documentName = this.name ?? FakeDataFactory.createFakeDocumentName();
    await sysAdminActor.attemptsTo(
      DynamicDocumentTasks.goto(),
      DynamicDocumentTasks.createFromAdminPage(appName, documentName)
    );

    try {
      await use(documentName);
    } finally {
      await sysAdminActor.attemptsTo(
        DynamicDocumentTasks.goto(),
        DynamicDocumentTasks.deleteFromAdminPage(documentName)
      );
    }
  }

  build(): (deps: TDeps, use: (documentName: string) => Promise<void>) => Promise<void> {
    const appNameFactory = this.appNameFactory;

    if (appNameFactory) {
      return (async (
        { sysAdminActor, app }: { sysAdminActor: WebActor; app: App },
        use: (documentName: string) => Promise<void>
      ) => {
        await this.runFixture(sysAdminActor, appNameFactory({ app }), use);
      }) as unknown as (deps: TDeps, use: (documentName: string) => Promise<void>) => Promise<void>;
    }

    return (async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (documentName: string) => Promise<void>) => {
      if (!this.appName) {
        throw new Error('DynamicDocumentFixture requires an appName. Use .forApp(...).');
      }
      await this.runFixture(sysAdminActor, this.appName, use);
    }) as (deps: TDeps, use: (documentName: string) => Promise<void>) => Promise<void>;
  }
}

export class DynamicDocumentFixture {
  static create(): DynamicDocumentFixtureBuilder {
    return new DynamicDocumentFixtureBuilder();
  }
}
