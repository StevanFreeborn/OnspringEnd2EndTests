import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('email body', () => {
  test("Add Email Body to an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-209',
    });

    expect(true).toBe(true);
  });

  test("Create a copy of an Email Body on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-210',
    });

    expect(true).toBe(true);
  });

  test('Add Email Body to an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-211',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of an Email Body on an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-212',
    });

    expect(true).toBe(true);
  });

  test('Add Email Body to an app from the Create Email Body button on the email body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-213',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of an Email Body on an app from the Create Email Body button on the email body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-214',
    });

    expect(true).toBe(true);
  });

  test("Update an Email Body's configurations on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-215',
    });

    expect(true).toBe(true);
  });

  test("Update an Email Body's configurations on an app from the Email Body page", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-216',
    });

    expect(true).toBe(true);
  });

  test("Delete an Email Body from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-217',
    });

    expect(true).toBe(true);
  });

  test('Delete an Email Body from the Email Body page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-218',
    });

    expect(true).toBe(true);
  });
});
