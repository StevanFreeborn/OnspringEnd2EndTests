import { App, FormattedTextBlock, LayoutItem } from '@stevanfreeborn/onspring-models';
import { AppTasks, FieldQuestions, FieldTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export type FieldLayoutPlacement = {
  tabName?: string;
  sectionName: string;
  column: number;
  row: number;
};

export async function createFieldsWithActor(actor: WebActor, app: App, fields: LayoutItem[]): Promise<LayoutItem[]> {
  await actor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));

  const createdFields: LayoutItem[] = [];

  for (const field of fields) {
    await actor.attemptsTo(FieldTasks.addFromGrid(field));

    if (!(field instanceof FormattedTextBlock)) {
      field.id = await actor.asks(FieldQuestions.fieldIdInGrid(field.name));
    }

    createdFields.push(field);
  }

  return createdFields;
}

export class FieldFixtureBuilder<TField extends LayoutItem> {
  private readonly fieldOrFactory: TField | (() => TField);
  private placement?: FieldLayoutPlacement;
  private cleanup = false;

  constructor(fieldOrFactory: TField | (() => TField)) {
    this.fieldOrFactory = fieldOrFactory;
  }

  onLayout(placement: FieldLayoutPlacement): this {
    this.placement = placement;
    return this;
  }

  withCleanup(enabled: boolean = true): this {
    this.cleanup = enabled;
    return this;
  }

  build() {
    const fieldOrFactory = this.fieldOrFactory;
    const placement = this.placement;
    const cleanup = this.cleanup;

    return async (
      { sysAdminActor, app }: { sysAdminActor: WebActor; app: App },
      use: (field: TField) => Promise<void>
    ) => {
      const field = typeof fieldOrFactory === 'function' ? fieldOrFactory() : fieldOrFactory;

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), FieldTasks.addFromGrid(field));

      if (!(field instanceof FormattedTextBlock)) {
        field.id = await sysAdminActor.asks(FieldQuestions.fieldIdInGrid(field.name));
      }

      if (placement) {
        await sysAdminActor.attemptsTo(
          AppTasks.openLayoutDesigner(),
          AppTasks.dragFieldOntoLayout({ ...placement, fieldName: field.name }),
          AppTasks.saveAndCloseLayout()
        );
      }

      try {
        await use(field);
      } finally {
        if (cleanup) {
          await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id), FieldTasks.deleteFromGrid(field.name));
        }
      }
    };
  }
}

export class FieldFixture {
  static create<TField extends LayoutItem>(fieldOrFactory: TField | (() => TField)): FieldFixtureBuilder<TField> {
    return new FieldFixtureBuilder<TField>(fieldOrFactory);
  }
}
