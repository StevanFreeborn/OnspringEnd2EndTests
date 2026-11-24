import {
  App,
  AppPermission,
  FakeDataFactory,
  FormattedTextBlock,
  LayoutItemPermission,
  Permission,
  Role,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AppLayoutTabTargets,
  AppQuestions,
  AppTasks,
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  FieldTargets,
  LayoutObjectTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, test as base, RoleFixture, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type FormattedTextBlockTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<FormattedTextBlockTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app!.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .build(),
  user: UserFixture.create()
    .withRoles(({ role }) => [role.name])
    .build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('formatted text block', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add a Formatted Text Block Object to an app from the Fields & Objects report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-176',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Verify the formatted text block was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(textBlock.name)).isVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the row copy button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-177',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Add the formatted text block to be copied', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Add a copy of the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.copyFromGridRow(textBlock.name, copiedTextBlockName));
    });

    await test.step('Verify the text block was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedTextBlockName)).isVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the Add Field button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-856',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Add the formatted text block to copy', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Add a copy of the formatted text block', async () => {
      await sysAdminActor.attemptsTo(
        LayoutObjectTasks.copyFromAddFieldButton('Formatted Text Block', textBlock.name, copiedTextBlockName)
      );
    });

    await test.step('Verify the text block was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedTextBlockName)).isVisible();
    });
  });

  test('Add a Formatted Text Block Object to an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-178',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromLayoutDesigner(textBlock));
    });

    await test.step('Verify the text block was added', async () => {
      const textBlockInBank = AppLayoutTabTargets.designer.objectFromBank(textBlock.name);
      await sysAdminActor.browse().check(textBlockInBank).isVisible();
      await sysAdminActor
        .browse()
        .check(textBlockInBank)
        .doesNotHaveClass(/ui-draggable-disabled/);

      await sysAdminActor.attemptsTo(AppTasks.closeLayout());

      await sysAdminActor.browse().check(FieldTargets.rowByName(textBlock.name)).isVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-179',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the formatted text block to copy', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromLayoutDesigner(textBlock));
    });

    await test.step('Add a copy of the formatted text block', async () => {
      await sysAdminActor.attemptsTo(
        LayoutObjectTasks.copyFromLayoutDesigner('Formatted Text Block', textBlock.name, copiedTextBlockName)
      );
    });

    await test.step('Verify the text block was copied', async () => {
      const copiedTextBlock = AppLayoutTabTargets.designer.objectFromBank(copiedTextBlockName);
      await sysAdminActor.browse().check(copiedTextBlock).isVisible();
      await sysAdminActor
        .browse()
        .check(copiedTextBlock)
        .doesNotHaveClass(/ui-draggable-disabled/);

      await sysAdminActor.attemptsTo(AppTasks.closeLayout());

      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedTextBlockName)).isVisible();
    });
  });

  test("Add a Formatted Text Block Object to an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-180',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the formatted text block that will be added to layout', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Add the formatted text block to the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: textBlock.name,
        })
      );

      const dropzone = await sysAdminActor.asks(
        AppQuestions.layoutDropzone({ tabName, sectionName, column: 0, row: 0 })
      );
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.designer.objectFromBank(textBlock.name))
        .hasClass(/ui-draggable-disabled/);
      await sysAdminActor.browse().check(dropzone).hasText(new RegExp(textBlock.name));

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Verify the text block was added to the layout', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const textBlockContent = ContentRecordTargets.objectInSection(section, textBlock.name);

      await sysAdminActor.browse().check(textBlockContent).isVisible();
      await sysAdminActor.browse().check(textBlockContent).hasText(new RegExp(textBlock.formattedText));
    });
  });

  test("Remove a Formatted Text Block Object from an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-181',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the formatted text block that will be removed from layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        LayoutObjectTasks.addFromLayoutDesigner(textBlock),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: textBlock.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Remove the text block from the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.removeObjectFromLayout({ tabName, sectionName, column: 0, row: 0 })
      );

      const dropzone = await sysAdminActor.asks(
        AppQuestions.layoutDropzone({ tabName, sectionName, column: 0, row: 0 })
      );
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.designer.objectFromBank(textBlock.name))
        .doesNotHaveClass(/ui-draggable-disabled/);
      await sysAdminActor.browse().check(dropzone).doesNotHaveText(new RegExp(textBlock.name));

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Verify the text block was removed from the layout', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));

      await sysAdminActor.browse().check(ContentRecordTargets.objectInSection(section, textBlock.name)).isHidden();
    });
  });

  test('Update the configuration of a Formatted Text Block Object on an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-182',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const updatedTextBlockName = `${textBlock.name} updated`;

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Update the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.updateNameFromGrid(textBlock.name, updatedTextBlockName));
    });

    await test.step('Verify the text block was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedTextBlockName)).isVisible();
    });
  });

  test('Delete a Formatted Text Block Object from an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-183',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(textBlock));
    });

    await test.step('Delete the formatted text block', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.deleteFromGrid(textBlock.name));
    });

    await test.step('Verify the text block was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(textBlock.name)).isHidden();
    });
  });

  test('Make a Formatted Text Block Object private by role to prevent access', async ({
    sysAdminActor,
    role,
    app,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-184',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should not be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        LayoutObjectTasks.addFromGrid(textBlock),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: textBlock.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the text block by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the text block is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor.browse().check(ContentRecordTargets.objectInSection(section, textBlock.name)).isHidden();
    });
  });

  test('Make a Formatted Text Block Object private by role to give access', async ({
    sysAdminActor,
    role,
    app,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-857',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        LayoutObjectTasks.addFromGrid(textBlock),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: textBlock.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does have access to the text block by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the text block is visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const textBlockContent = ContentRecordTargets.objectInSection(section, textBlock.name);

      await testUserActor.browse().check(textBlockContent).isVisible();
      await testUserActor.browse().check(textBlockContent).hasText(new RegExp(textBlock.formattedText));
    });
  });

  test('Make a Formatted Text Block Object public', async ({ sysAdminActor, role, app, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-185',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        LayoutObjectTasks.addFromGrid(textBlock),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: textBlock.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the text block by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the text block is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor.browse().check(ContentRecordTargets.objectInSection(section, textBlock.name)).isHidden();
    });

    await test.step('Update the text block so that it is public', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        LayoutObjectTasks.updatePermissionsFromGrid(textBlock.name, [])
      );
    });

    await test.step('Navigate to created record again as test user', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
      await testUserActor.browse().reload();
    });

    await test.step('Verify the text block is visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const textBlockContent = ContentRecordTargets.objectInSection(section, textBlock.name);

      await testUserActor.browse().check(textBlockContent).isVisible();
      await testUserActor.browse().check(textBlockContent).hasText(new RegExp(textBlock.formattedText));
    });
  });
});
