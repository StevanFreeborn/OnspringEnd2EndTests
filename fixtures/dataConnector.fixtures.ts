import { DataConnectorType, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { DataConnectorQuestions, DataConnectorTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export type DataConnectorFixtureData = {
  id: number;
  name: string;
  type: DataConnectorType;
};

export class DataConnectorFixtureBuilder {
  private name?: string;
  private type: DataConnectorType = 'Ascent Data Connector';

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withType(type: DataConnectorType): this {
    this.type = type;
    return this;
  }

  build() {
    const connectorType = this.type;
    const configuredName = this.name;

    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (connector: DataConnectorFixtureData) => Promise<void>
    ) => {
      const name = configuredName ?? FakeDataFactory.createFakeDataConnectorName();
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto(), DataConnectorTasks.create(name, connectorType));
      const id = await sysAdminActor.asks(DataConnectorQuestions.currentId());

      try {
        await use({ id, name, type: connectorType });
      } finally {
        await sysAdminActor.attemptsTo(DataConnectorTasks.deleteConnectors([name]));
      }
    };
  }
}

export class DataConnectorFixture {
  static create(): DataConnectorFixtureBuilder {
    return new DataConnectorFixtureBuilder();
  }
}
