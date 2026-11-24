import {
  App,
  AppPermission,
  FakeDataFactory,
  LayoutItemPermission,
  Permission,
  ReferenceField,
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

type ReferenceFieldTestFixtures = {
  app: App;
  referencedApp: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<ReferenceFieldTestFixtures>({
  app: AppFixture.create().build(),
  referencedApp: AppFixture.create().build(),
  role: async ({ sysAdminActor, app, referencedApp }, use) => {
    const roleFixture = RoleFixture.create()
      .withAppPermissions([
        new AppPermission({
          appName: app.name,
          contentRecords: new Permission({ read: true }),
        }),
        new AppPermission({
          appName: referencedApp.name,
          referencedRecords: new Permission({ read: true }),
        }),
      ])
      .build();

    await roleFixture({ sysAdminActor }, use);
  },
  user: UserFixture.create()
    .withRoles(({ role }) => [role.name])
    .build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('reference field', () => {
  test.beforeEach(async ({ sysAdminActor, app, referencedApp }) => {
    void referencedApp;
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add a Reference Field to an app from the Fields & Objects report', async ({
    sysAdminActor,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-116',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Add the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Verify the field was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(referencedApp.id));
      await sysAdminActor.browse().check(FieldTargets.rowByName(app.name)).isVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from the Fields & Objects report using the row copy button', async ({
    sysAdminActor,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-117',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Add the the reference field to be copied', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the reference field', async () => {
      await sysAdminActor.attemptsTo(
        FieldTasks.copyFromGridRow(field.name, copiedFieldName, { waitForSelectedGridFields: true })
      );
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(referencedApp.id));
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedParallelFieldName)).isVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from the Fields & Objects report using the Add Field button', async ({
    sysAdminActor,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-854',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Add the reference field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromAddFieldButton(field.type, field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(referencedApp.id));
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedParallelFieldName)).isVisible();
    });
  });

  test('Add a Reference Field to an app from a layout', async ({ sysAdminActor, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-118',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the reference field', async () => {
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

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(referencedApp.id));
      await sysAdminActor.browse().check(FieldTargets.rowByName(app.name)).isVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from a layout', async ({ sysAdminActor, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-119',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the reference field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Add a copy of the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromLayoutDesigner('Reference', field.name, copiedFieldName));
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

      await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(referencedApp.id));
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedParallelFieldName)).isVisible();
    });
  });

  test("Add a Reference Field to an app's layout", async ({ sysAdminActor, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-120',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the reference field that will be added to layout', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add the reference field to the layout', async () => {
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
      await sysAdminActor.browse().check(ContentRecordTargets.referenceFieldInSection(section, field.name)).isVisible();
    });
  });

  test("Remove a Reference Field from an app's layout", async ({ sysAdminActor, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-121',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the reference field that will be removed from layout', async () => {
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

    await test.step('Remove the reference field from the layout', async () => {
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
      await sysAdminActor.browse().check(ContentRecordTargets.referenceFieldInSection(section, field.name)).isHidden();
    });
  });

  test('Update the configuration of a Reference Field on an app', async ({ sysAdminActor, referencedApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-122',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Update the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.updateNameFromGrid(field.name, updatedFieldName));
    });

    await test.step('Verify the field was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedFieldName)).isVisible();
    });
  });

  test('Delete a Reference Field from an app', async ({ sysAdminActor, referencedApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-123',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Add the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Delete the reference field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
    });

    await test.step('Verify the field was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isHidden();
    });
  });

  test('Make a Reference Field private by role to prevent access', async ({
    sysAdminActor,
    referencedApp,
    app,
    role,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-124',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.asks(
        ContentQuestions.createNewReferencedRecord({
          tabName,
          sectionName,
          fieldName: field.name,
        })
      );
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceFieldInSection(section, field.name))
        .isHidden();
    });
  });

  test('Make a Reference Field private by role to give access', async ({
    sysAdminActor,
    referencedApp,
    app,
    role,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-855',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;
    let referencedRecordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      referencedRecordId = await sysAdminActor.asks(
        ContentQuestions.createNewReferencedRecord({
          tabName,
          sectionName,
          fieldName: field.name,
        })
      );
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceFieldInSection(section, field.name))
        .isVisible();
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceRecordRowInSection(section, field.name, referencedRecordId))
        .isVisible();
    });
  });

  test('Make a Reference Field public', async ({ sysAdminActor, referencedApp, app, role, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-125',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;
    let referencedRecordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      referencedRecordId = await sysAdminActor.asks(
        ContentQuestions.createNewReferencedRecord({
          tabName,
          sectionName,
          fieldName: field.name,
        })
      );
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await testUserActor.attemptsTo(ContentTasks.gotoView(app.id, recordId));
    });

    await test.step('Verify the field is not visible', async () => {
      const section = await testUserActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceFieldInSection(section, field.name))
        .isHidden();
    });

    await test.step('Update the reference field so that it is public', async () => {
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
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceFieldInSection(section, field.name))
        .isVisible();
      await testUserActor
        .browse()
        .check(ContentRecordTargets.readOnlyReferenceRecordRowInSection(section, field.name, referencedRecordId))
        .isVisible();
    });
  });
});
