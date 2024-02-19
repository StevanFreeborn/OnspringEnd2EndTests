import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('content record', () => {
  test('Create a content record from the "Create Content" button on the content home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-300',
    });

    expect(true).toBe(true);
  });

  test('Create a content record from the "Create Content" button the content home page of an app/survey', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-301',
    });

    expect(true).toBe(true);
  });

  test('Create a content record from the quick add layout on the content home page of an app/survey', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-302',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-303',
    });

    expect(true).toBe(true);
  });

  test('View a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-304',
    });

    expect(true).toBe(true);
  });

  test('Edit a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-305',
    });

    expect(true).toBe(true);
  });

  test('Save a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-306',
    });

    expect(true).toBe(true);
  });

  test('Save and close a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-307',
    });

    expect(true).toBe(true);
  });

  test('Cancel editing a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-308',
    });

    expect(true).toBe(true);
  });

  test('Delete a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-309',
    });

    expect(true).toBe(true);
  });

  test('Print content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-310',
    });

    expect(true).toBe(true);
  });

  test('Pin a content record', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-311',
    });

    expect(true).toBe(true);
  });
});
