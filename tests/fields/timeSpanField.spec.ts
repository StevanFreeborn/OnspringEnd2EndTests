import { expect, fieldTest as test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('time span field', async () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Time Span Field to an app from the Fields & Objects report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-126',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Create a copy of a Time Span Field on an app from the Fields & Objects report using row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-127',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Create a copy of a Time Span Field on an app from the Fields & Objects report using Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-817',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Add a Time Span Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-128',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Create a copy of a Time Span Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-129',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test("Add a Time Span Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-130',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test("Remove a Time Span Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-131',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Time Span Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-132',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Delete a Time Span Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-133',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make a Time Span Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-134',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make a Time Span Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-818',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make a Time Span Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-135',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });
});
