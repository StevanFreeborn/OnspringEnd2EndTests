import {
  App,
  AppPermission,
  FakeDataFactory,
  LayoutItemPermission,
  Permission,
  Role,
  TimeSpanField,
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
  TimeSpanUnits,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, test as base, RoleFixture, UserFixture } from '../../fixtures';
import { escapeRegExp } from '../../utils';
import { AnnotationType } from '../annotations';

type TimeSpanFieldTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<TimeSpanFieldTestFixtures>({
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

test.describe('time span field', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add a Time Span Field to an app from the Fields & Objects report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-126',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Verify the field was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();
    });
  });

  test('Create a copy of a Time Span Field on an app from the Fields & Objects report using row copy button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-127',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the time span field to be copied', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromGridRow(field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Create a copy of a Time Span Field on an app from the Fields & Objects report using Add Field button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-817',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the time span field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromAddFieldButton(field.type, field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Add a Time Span Field to an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-128',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the time span field', async () => {
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

  test('Create a copy of a Time Span Field on an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-129',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the time span field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Add a copy of the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromLayoutDesigner('Time Span', field.name, copiedFieldName));
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

  test("Add a Time Span Field to an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-130',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the time span field that will be added to layout', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add the time span field to the layout', async () => {
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
      await sysAdminActor.browse().check(ContentRecordTargets.timeSpanFieldInSection(section, field.name)).isVisible();
    });
  });

  test("Remove a Time Span Field from an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-131',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the time span field that will be removed from layout', async () => {
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

    await test.step('Remove the time span field from the layout', async () => {
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
      await sysAdminActor.browse().check(ContentRecordTargets.timeSpanFieldInSection(section, field.name)).isHidden();
    });
  });

  test('Update the configuration of a Time Span Field on an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-132',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Update the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.updateNameFromGrid(field.name, updatedFieldName));
    });

    await test.step('Verify the field was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedFieldName)).isVisible();
    });
  });

  test('Delete a Time Span Field from an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-133',
    });

    const field = new TimeSpanField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Delete the time span field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
    });

    await test.step('Verify the field was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isHidden();
    });
  });

  test('Make a Time Span Field private by role to prevent access', async ({
    sysAdminActor,
    role,
    app,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-134',
    });

    const field = new TimeSpanField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the time span field', async () => {
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

    await test.step('Create a record with a value in the time span field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.fillTimeSpanField({
          tabName,
          sectionName,
          fieldName: field.name,
          quantity: '1',
          unit: 'Days',
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

  test('Make a Time Span Field private by role to give access', async ({ sysAdminActor, role, app, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-818',
    });

    const field = new TimeSpanField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const quantity = '1';
    const fieldValue = `${quantity} ${TimeSpanUnits.Days}`;
    let recordId: number;

    await test.step('Add the time span field', async () => {
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

    await test.step('Create a record with a value in the time span field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.fillTimeSpanField({
          tabName,
          sectionName,
          fieldName: field.name,
          quantity,
          unit: 'Days',
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

      const escapedFieldValue = escapeRegExp(fieldValue);
      await testUserActor.browse().check(readOnlyField).hasText(new RegExp(escapedFieldValue));
    });
  });

  test('Make a Time Span Field public', async ({ sysAdminActor, role, app, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-135',
    });

    const field = new TimeSpanField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const quantity = '1';
    const fieldValue = `${quantity} ${TimeSpanUnits.Days}`;
    let recordId: number;

    await test.step('Add the time span field', async () => {
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

    await test.step('Create a record with a value in the time span field as system admin', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.fillTimeSpanField({
          tabName,
          sectionName,
          fieldName: field.name,
          quantity,
          unit: 'Days',
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

    await test.step('Update the time span field so that it is public', async () => {
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

      const escapedFieldValue = escapeRegExp(fieldValue);
      await testUserActor.browse().check(readOnlyField).hasText(new RegExp(escapedFieldValue));
    });
  });
});
