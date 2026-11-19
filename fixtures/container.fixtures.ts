import { Container, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { ContainerTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class ContainerFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (container: Container) => Promise<void>) => {
      const containerName = this.name ?? FakeDataFactory.createFakeContainerName();
      await sysAdminActor.attemptsTo(ContainerTasks.create(containerName));
      const container = new Container({ name: containerName });

      try {
        await use(container);
      } finally {
        await sysAdminActor.attemptsTo(ContainerTasks.deleteContainers([containerName]));
      }
    };
  }
}

export class ContainerFixture {
  static create(): ContainerFixtureBuilder {
    return new ContainerFixtureBuilder();
  }
}

export const container = ContainerFixture.create().build();
