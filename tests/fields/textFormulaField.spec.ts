import { expect, fieldTest as test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('text formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Text Formula Field to an app from the Fields & Objects report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-136',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Text Formula Field on an app from the Fields & Objects report using the row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-137',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Text Formula Field on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-820',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Text Formula Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-138',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Text Formula Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-139',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Text Formula Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-140',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Text Formula Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-141',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Text Formula Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-142',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Text Formula Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-143',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Text Formula Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-144',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Text Formula Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-821',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Text Formula Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-145',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
