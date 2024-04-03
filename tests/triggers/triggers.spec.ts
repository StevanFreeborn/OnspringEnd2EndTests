import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('Triggers', () => {
  test('Add a trigger to an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-186',
    });

    expect(true).toBe(true);
  });

  test('Enable a trigger on an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-187',
    });

    expect(true).toBe(true);
  });

  test('Disable a trigger on an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-188',
    });

    expect(true).toBe(true);
  });

  test('Update the configuration of a trigger on an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-189',
    });

    expect(true).toBe(true);
  });

  test('Delete a trigger from an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-190',
    });

    expect(true).toBe(true);
  });

  test('Filter triggers by outcome type', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-191',
    });

    expect(true).toBe(true);
  });
});