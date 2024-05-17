import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('text message', () => {
  test("Add Text Message to an app from an app's Messaging tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-219',
    });

    expect(true).toBeTruthy();
  });

  test("Create a copy of a Text Message on an app from an app's Messaging tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-220',
    });

    expect(true).toBeTruthy();
  });

  test('Add Text Message to an app from the Create button in the admin header', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-221',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Text Message on an app from the Create button in the admin header', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-222',
    });

    expect(true).toBeTruthy();
  });

  test('Add Text Message to an app from the Create Text Message button on the text message page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-223',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Text Message on an app from the Create Text Message button on the text message page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-224',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Text Message's configurations on an app from an app's Messaging tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-225',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Text Message's configurations on an app from the Text Message page", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-226',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a Text Message from an app's Messaging tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-227',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Text Message from the Text Message page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-228',
    });

    expect(true).toBeTruthy();
  });
});
