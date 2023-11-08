import { expect, fieldTest as test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('list formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a List Formula Field to an app from the Fields & Objects report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-166',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a List Formula Field on an app from the Fields & Objects report using the row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-167',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a List Formula Field on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-830',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Add a List Formula Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-168',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a List Formula Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-169',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Add a List Formula Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-170',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Remove a List Formula Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-171',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a List Formula Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-173',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Delete a List Formula Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-172',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-174',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-831',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-175',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });
});
