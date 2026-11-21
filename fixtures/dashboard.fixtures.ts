import {
  Container,
  Dashboard,
  DashboardItemWithLocation,
  FakeDataFactory,
  SavedReport,
} from '@stevanfreeborn/onspring-models';
import { DashboardQuestions, DashboardTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class DashboardFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private name?: string;
  private containers: string[] = [];
  private containersFactory?: (deps: { container: Container }) => string[];
  private items: DashboardItemWithLocation[] = [];
  private itemsFactory?: (deps: { report: SavedReport }) => DashboardItemWithLocation[];
  private configure?: (dashboard: Dashboard) => void;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withContainers(containers: string[]): this;
  withContainers(
    factory: (deps: { container: Container }) => string[]
  ): DashboardFixtureBuilder<TDeps & { container: Container }>;
  withContainers(
    containersOrFactory: string[] | ((deps: { container: Container }) => string[])
  ): this | DashboardFixtureBuilder<TDeps & { container: Container }> {
    if (Array.isArray(containersOrFactory)) {
      this.containers.push(...containersOrFactory);
      return this;
    }

    this.containersFactory = containersOrFactory;
    return this as unknown as DashboardFixtureBuilder<TDeps & { container: Container }>;
  }

  withItems(items: DashboardItemWithLocation[]): this;
  withItems(
    factory: (deps: { report: SavedReport }) => DashboardItemWithLocation[]
  ): DashboardFixtureBuilder<TDeps & { report: SavedReport }>;
  withItems(
    itemsOrFactory: DashboardItemWithLocation[] | ((deps: { report: SavedReport }) => DashboardItemWithLocation[])
  ): this | DashboardFixtureBuilder<TDeps & { report: SavedReport }> {
    if (Array.isArray(itemsOrFactory)) {
      this.items.push(...itemsOrFactory);
      return this;
    }

    this.itemsFactory = itemsOrFactory;
    return this as unknown as DashboardFixtureBuilder<TDeps & { report: SavedReport }>;
  }

  withConfiguration(configure: (dashboard: Dashboard) => void): this {
    this.configure = configure;
    return this;
  }

  private async runFixture(
    sysAdminActor: WebActor,
    containers: string[],
    items: DashboardItemWithLocation[],
    use: (dashboard: Dashboard) => Promise<void>
  ): Promise<void> {
    const dashboard = new Dashboard({
      name: this.name ?? FakeDataFactory.createFakeDashboardName(),
      containers,
      items,
    });

    if (this.configure) {
      this.configure(dashboard);
    }

    await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage(), DashboardTasks.createFromAdminPage(dashboard.name));
    dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
    await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());

    try {
      await use(dashboard);
    } finally {
      await sysAdminActor.attemptsTo(DashboardTasks.deleteDashboards([dashboard.name]));
    }
  }

  build(): (deps: TDeps, use: (dashboard: Dashboard) => Promise<void>) => Promise<void> {
    const containersFactory = this.containersFactory;
    const itemsFactory = this.itemsFactory;

    if (containersFactory && itemsFactory) {
      return (async (
        { sysAdminActor, container, report }: { sysAdminActor: WebActor; container: Container; report: SavedReport },
        use: (dashboard: Dashboard) => Promise<void>
      ) => {
        await this.runFixture(
          sysAdminActor,
          [...this.containers, ...containersFactory({ container })],
          [...this.items, ...itemsFactory({ report })],
          use
        );
      }) as unknown as (deps: TDeps, use: (dashboard: Dashboard) => Promise<void>) => Promise<void>;
    }

    if (containersFactory) {
      return (async (
        { sysAdminActor, container }: { sysAdminActor: WebActor; container: Container },
        use: (dashboard: Dashboard) => Promise<void>
      ) => {
        await this.runFixture(
          sysAdminActor,
          [...this.containers, ...containersFactory({ container })],
          [...this.items],
          use
        );
      }) as unknown as (deps: TDeps, use: (dashboard: Dashboard) => Promise<void>) => Promise<void>;
    }

    if (itemsFactory) {
      return (async (
        { sysAdminActor, report }: { sysAdminActor: WebActor; report: SavedReport },
        use: (dashboard: Dashboard) => Promise<void>
      ) => {
        await this.runFixture(sysAdminActor, [...this.containers], [...this.items, ...itemsFactory({ report })], use);
      }) as unknown as (deps: TDeps, use: (dashboard: Dashboard) => Promise<void>) => Promise<void>;
    }

    return (async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (dashboard: Dashboard) => Promise<void>) => {
      await this.runFixture(sysAdminActor, [...this.containers], [...this.items], use);
    }) as (deps: TDeps, use: (dashboard: Dashboard) => Promise<void>) => Promise<void>;
  }
}

export class DashboardFixture {
  static create(): DashboardFixtureBuilder {
    return new DashboardFixtureBuilder();
  }
}
