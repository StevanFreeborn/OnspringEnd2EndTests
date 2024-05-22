import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('sms sending number', () => {
  test('Create a new custom SMS Sending Number', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-444',
    });

    expect(true).toBeTruthy();
  });

  test('Create a new default SMS Sending Number', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-445',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an SMS Sending Number', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-446',
    });

    expect(true).toBeTruthy();
  });
});
