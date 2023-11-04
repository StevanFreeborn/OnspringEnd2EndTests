import { expect, fieldTest as test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('number field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Number Field to an app from the Fields & Objects report', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-66',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Number Field on an app from the Fields & Objects report', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-67',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Number Field to an app from a layout.', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-68',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Number Field on an app from a layout', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-75',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Number Field to an app's layout", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-76',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Number Field from an app's layout", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-77',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Number Field on an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-78',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Number Field from an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-79',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field private by role to prevent access', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-101',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field private by role to give access', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-811',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field public', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-104',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
