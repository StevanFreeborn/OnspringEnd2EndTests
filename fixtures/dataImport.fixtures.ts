import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { DataImportQuestions, DataImportTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export type DataImportFixtureData = {
  id: number;
  name: string;
};

export class DataImportFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    const configuredName = this.name;

    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (dataImport: DataImportFixtureData) => Promise<void>
    ) => {
      const name = configuredName ?? FakeDataFactory.createFakeDataImportName();
      await sysAdminActor.attemptsTo(DataImportTasks.goto(), DataImportTasks.create(name));
      const id = await sysAdminActor.asks(DataImportQuestions.currentId());

      try {
        await use({ id, name });
      } finally {
        await sysAdminActor.attemptsTo(DataImportTasks.deleteDataImports([name]));
      }
    };
  }
}

export class DataImportFixture {
  static create(): DataImportFixtureBuilder {
    return new DataImportFixtureBuilder();
  }
}

export const dataImport = DataImportFixture.create().build();
