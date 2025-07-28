import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type UCFDataConnectorTestFixtures = {};

const test = base.extend<UCFDataConnectorTestFixtures>({});

test.describe('ucf data connector', () => {
  test('Create a new UCF connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-423',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a UCF connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-424',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a UCF connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-425',
    });

    expect(true).toBeTruthy();
  });
});
