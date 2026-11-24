import {
  App,
  AppPermission,
  AttachmentField,
  FakeDataFactory,
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
  FieldTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, test as base, RoleFixture, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type AttachmentFieldTestFixtures = {
  app: App;
  role: Role;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<AttachmentFieldTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .build(),
  user: UserFixture.create()
    .withRoles(({ role }) => [role.name])
    .build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('attachment field', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add an Attachment Field to an app from the Fields & Objects report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-88',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Verify the field was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isVisible();
    });
  });

  test('Create a copy of an Attachment Field on an app from the Fields & Objects report using the row copy button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-89',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the attachment field to be copied', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromGridRow(field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Create a copy of an Attachment Field on an app from the Fields & Objects report using the Add Field button', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-852',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the attachment field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add a copy of the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromAddFieldButton(field.type, field.name, copiedFieldName));
    });

    await test.step('Verify the field was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedFieldName)).isVisible();
    });
  });

  test('Add an Attachment Field to an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-90',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Verify the attachment field was added', async () => {
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

  test('Create a copy of an Attachment Field on an app from a layout', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-91',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());
    });

    await test.step('Add the attachment field to copy', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromLayoutDesigner(field));
    });

    await test.step('Add a copy of the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.copyFromLayoutDesigner('Attachment', field.name, copiedFieldName));
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

  test("Add an Attachment Field to an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-92',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the attachment field that will be added to layout', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Add the attachment field to the layout', async () => {
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
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.attachmentFieldInSection(section, field.name))
        .isVisible();
    });
  });

  test("Remove an Attachment Field from an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-93',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the attachment field that will be removed from layout', async () => {
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

    await test.step('Remove the attachment field from the layout', async () => {
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
      await sysAdminActor.browse().check(ContentRecordTargets.attachmentFieldInSection(section, field.name)).isHidden();
    });
  });

  test('Update the configuration of an Attachment Field on an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-94',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Update the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.updateNameFromGrid(field.name, updatedFieldName));
    });

    await test.step('Verify the field was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedFieldName)).isVisible();
    });
  });

  test('Delete an Attachment Field from an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-95',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.addFromGrid(field));
    });

    await test.step('Delete the attachment field', async () => {
      await sysAdminActor.attemptsTo(FieldTasks.deleteFromGrid(field.name));
    });

    await test.step('Verify the field was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(field.name)).isHidden();
    });
  });

  test('Make an Attachment Field private by role to prevent access', async ({
    sysAdminActor,
    app,
    role,
    testUserActor,
    txtFile,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-96',
    });

    const field = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the attachment field', async () => {
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

    await test.step('Create a record with a value in the attachment field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.asks(
        ContentQuestions.uploadAttachment({
          tabName,
          sectionName,
          fieldName: field.name,
          filePath: txtFile.path,
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
      await testUserActor.browse().check(ContentRecordTargets.attachmentFieldInSection(section, field.name)).isHidden();
    });
  });

  test('Make an Attachment Field private by role to give access', async ({
    sysAdminActor,
    app,
    role,
    testUserActor,
    txtFile,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-853',
    });

    const field = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the attachment field', async () => {
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

    await test.step('Create a record with a value in the attachment field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.asks(
        ContentQuestions.uploadAttachment({
          tabName,
          sectionName,
          fieldName: field.name,
          filePath: txtFile.path,
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
        .check(ContentRecordTargets.attachmentFieldInSection(section, field.name))
        .isAttached();
      await testUserActor
        .browse()
        .check(ContentRecordTargets.attachmentRowInSection(section, field.name, txtFile.name))
        .isVisible();
    });
  });

  test('Make an Attachment Field public', async ({ sysAdminActor, app, role, testUserActor, txtFile }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-97',
    });

    const field = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let recordId: number;

    await test.step('Add the attachment field', async () => {
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

    await test.step('Create a record with a value in the attachment field as system admin', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.asks(
        ContentQuestions.uploadAttachment({
          tabName,
          sectionName,
          fieldName: field.name,
          filePath: txtFile.path,
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
      await testUserActor.browse().check(ContentRecordTargets.attachmentFieldInSection(section, field.name)).isHidden();
    });

    await test.step('Update the attachment field so that it is public', async () => {
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
        .check(ContentRecordTargets.attachmentFieldInSection(section, field.name))
        .isAttached();
      await testUserActor
        .browse()
        .check(ContentRecordTargets.attachmentRowInSection(section, field.name, txtFile.name))
        .isVisible();
    });
  });

  test('Upload a large file to an attachment Field', async ({ sysAdminActor, app, large149mbTxtFile }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-918',
    });

    const field = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the attachment field', async () => {
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

    await test.step('Create a record and upload the large file to the attachment field', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.asks(
        ContentQuestions.uploadAttachment({
          tabName,
          sectionName,
          fieldName: field.name,
          filePath: large149mbTxtFile.path,
          timeout: 120_000,
        })
      );
      await sysAdminActor.attemptsTo(ContentTasks.saveRecord());
    });

    await test.step('Verify the file was uploaded successfully', async () => {
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.attachmentRowInSection(section, field.name, large149mbTxtFile.name))
        .isVisible();
    });
  });

  test('Upload a file that exceeds the max file size limit to an attachment Field', async ({
    sysAdminActor,
    app,
    large151mbTxtFile,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-919',
    });

    const field = new AttachmentField({
      name: FakeDataFactory.createFakeFieldName(),
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the attachment field', async () => {
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

    await test.step('Create a record and attempt to upload the large file to the attachment field', async () => {
      await sysAdminActor.attemptsTo(
        ContentTasks.gotoAdd(app.id),
        ContentTasks.attemptAttachmentUpload({
          tabName,
          sectionName,
          fieldName: field.name,
          filePath: large151mbTxtFile.path,
        })
      );
    });

    await test.step('Verify the file upload fails', async () => {
      await sysAdminActor.browse().check(ContentRecordTargets.fileUploadErrorDialog).isVisible();
    });
  });
});
