import { App } from '@stevanfreeborn/onspring-models';
import { AppTasks, ContentRecordTargets, ContentTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type QuickAddContentLayoutTestFixtures = {
  app: App;
};

const test = base.extend<QuickAddContentLayoutTestFixtures>({
  app: AppFixture.create().build(),
});

async function enableQuickAddContentLayout(actor: WebActor): Promise<void> {
  await actor.attemptsTo(
    AppTasks.openLayoutDesigner('Quick Content Add'),
    AppTasks.updateLayoutProperties({ enabled: true }),
    AppTasks.dragFieldOntoLayout({
      fieldName: 'Record Id',
      tabName: 'Tab 2',
      sectionName: 'Section 1',
      column: 0,
      row: 0,
    }),
    AppTasks.saveAndCloseLayout()
  );
}

test.describe('quick add content layout', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test("Enable an app's quick add content layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-30',
    });

    await test.step('Enable the quick add content layout', async () => {
      await enableQuickAddContentLayout(sysAdminActor);
    });

    await test.step('Verify the quick add content layout is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAppContent(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.quickContentAddForm).isVisible();
    });
  });

  test("Disable an app's quick add content layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-31',
    });

    await test.step('Enable the quick add content layout', async () => {
      await enableQuickAddContentLayout(sysAdminActor);
    });

    await test.step('Verify the quick add content layout is enabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAppContent(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.quickContentAddForm).isVisible();
    });

    await test.step('Disable the quick add content layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        AppTasks.openLayoutDesigner('Quick Content Add'),
        AppTasks.updateLayoutProperties({ enabled: false }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the quick add content layout is disabled', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAppContent(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.quickContentAddForm).isHidden();
    });
  });
});
