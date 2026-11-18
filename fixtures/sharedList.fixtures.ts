import { FakeDataFactory, SharedList } from '@stevanfreeborn/onspring-models';
import { SharedListTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class SharedListFixtureBuilder {
  private name?: string;
  private description?: string;
  private status?: boolean;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withStatus(status: boolean): this {
    this.status = status;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (list: SharedList) => Promise<void>
    ) => {
      const listName = this.name ?? FakeDataFactory.createFakeListName();
      const list = new SharedList({
        name: listName,
        description: this.description ?? '',
        status: this.status ?? true,
      });

      await sysAdminActor.attemptsTo(SharedListTasks.create(list.name));
      if (this.description !== undefined || this.status !== undefined) {
        await sysAdminActor.attemptsTo(SharedListTasks.update(list));
      }

      try {
        await use(list);
      } finally {
        await sysAdminActor.attemptsTo(SharedListTasks.deleteLists([list.name]));
      }
    };
  }
}

export class SharedListFixture {
  static create(): SharedListFixtureBuilder {
    return new SharedListFixtureBuilder();
  }
}

export const sharedList = SharedListFixture.create().build();
