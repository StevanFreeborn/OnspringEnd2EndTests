import {
  App,
  AppPermission,
  FakeDataFactory,
  LayoutItemPermission,
  ListField,
  ListValue,
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
  FieldTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, test as base, RoleFixture, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type ListFieldTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<ListFieldTestFixtures>({
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

test.describe('list field', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add a List Field to an app from the Fields & Objects report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-60',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Verify the field was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();
    });
  });

  test('Create a copy of a List Field on an app from the Fields & Objects report using row copy button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-61',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the list field to be copied', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromGridRow(field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Create a copy of a List Field on an app from the Fields & Objects report using Add Field button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-815',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the list field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromAddFieldButton(field.type, field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Add a List Field to an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-62',
    });

    const field = new ListField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Verify the field was added', async () => {
      const fieldInBank = AppLayoutTabTargets.designer.fieldFromBank(field.name);
      await sysAdminActor.browse().check(fieldInBank).isVisible();
      await sysAdminActor
        .browse()
        .check(fieldInBank)
        .doesNotHaveClass(/ui-draggable-disabled/);

      await sysAdminActor.attemptsTo(AppTasks.closeLayout());

      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();
    });
  });

  test('Create a copy of a List Field on an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-63',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the list field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Add a copy of the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromLayoutDesigner('List', field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      const copiedField = AppLayoutTabTargets.designer.fieldFromBank(copiedFieldName);
      await sysAdminActor.browse().check(copiedField).isVisible();
      await sysAdminActor
        .browse()
        .check(copiedField)
        .doesNotHaveClass(/ui-draggable-disabled/);

      await sysAdminActor.attemptsTo(AppTasks.closeLayout());

      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test("Add a List Field to an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-65',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the list field that will be added to layout', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add the list field to the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: field.name,
        })
      );

      const dropzone = await sysAdminActor.asks(
        AppQuestions.layoutDropzone({ tabName, sectionName, column: 0, row: 0 })
      );
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.designer.fieldFromBank(field.name))
        .hasClass(/ui-draggable-disabled/);
      await sysAdminActor.browse().check(dropzone).hasText(new RegExp(field.name));

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Verify the field was added to the layout', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));

      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor.browse().check(ContentRecordTargets.listFieldInSection(section, field.name)).isVisible();
    });
  });

  test("Remove a List Field from an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-71',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the list field that will be removed from layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        FieldTasks.addFromLayoutDesigner(field),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: field.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Remove the list field from the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.removeFieldFromLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
        })
      );

      const dropzone = await sysAdminActor.asks(
        AppQuestions.layoutDropzone({ tabName, sectionName, column: 0, row: 0 })
      );
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.designer.fieldFromBank(field.name))
        .doesNotHaveClass(/ui-draggable-disabled/);
      await sysAdminActor.browse().check(dropzone).doesNotHaveText(new RegExp(field.name));

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Verify the field was removed from the layout', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));

      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor.browse().check(ContentRecordTargets.listFieldInSection(section, field.name)).isHidden();
    });
  });

  test('Delete a List Field from an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-72',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Delete the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
    });

    await test.step('Verify the field was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isHidden();
    });
  });

  test('Update the configuration of a List Field on an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-74',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
    });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Update the list field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.updateNameFromGrid(field.name, updatedFieldName));
    });

    await test.step('Verify the field was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedFieldName)).isVisible();
    });
  });

  test('Make a List Field private by role to prevent access', async ({ sysAdminActor, app, role, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-100',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        FieldTasks.addFromGrid(field),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: field.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with a value in the list field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: field.name,
          value: field.values[0].value,
        }),
        ContentTasks.saveRecord()
      );
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, field.name))
        .isHidden();
    });
  });

  test('Make a List Field private by role to give access', async ({ sysAdminActor, role, app, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-816',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: true })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const fieldValue = field.values[0].value;
    let recordId: number;

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        FieldTasks.addFromGrid(field),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: field.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with a value in the list field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: field.name,
          value: fieldValue,
        }),
        ContentTasks.saveRecord()
      );
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const readOnlyField = ContentRecordTargets.readOnlyTextFieldInSection(section, field.name);
      await testUserActor.browse().check(readOnlyField).isVisible();
      await testUserActor.browse().check(readOnlyField).hasText(new RegExp(fieldValue));
    });
  });

  test('Make a List Field public', async ({ sysAdminActor, role, app, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-103',
    });

    const field = new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const fieldValue = field.values[0].value;
    let recordId: number;

    await test.step('Add the list field', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        FieldTasks.addFromGrid(field),
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          fieldName: field.name,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Create a record with a value in the list field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.selectListField({
          tabName,
          sectionName,
          fieldName: field.name,
          value: fieldValue,
        }),
        ContentTasks.saveRecord()
      );
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, field.name))
        .isHidden();
    });

    await test.step('Update the list field so that it is public', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.gotoAppLayoutTab(app.id),
        FieldTasks.updatePermissionsFromGrid(field.name, [])
      );
    });

    await test.step('Navigate to created record again as test user', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
      await testUserActor.browse().reload();
    });

    await test.step('Verify the field is visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const readOnlyField = ContentRecordTargets.readOnlyTextFieldInSection(section, field.name);
      await testUserActor.browse().check(readOnlyField).isVisible();
      await testUserActor.browse().check(readOnlyField).hasText(new RegExp(fieldValue));
    });
  });
});
