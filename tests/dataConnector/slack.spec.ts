import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SlackAppDataConnectorTestFixtures = {};

const test = base.extend<SlackAppDataConnectorTestFixtures>({});

test.describe('slack app data connector', () => {
  test('Create a new Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-437',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-438',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-439',
    });

    expect(true).toBeTruthy();
  });
});
