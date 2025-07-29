import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SecurityScorecardDataConnectorTestFixtures = {};

const test = base.extend<SecurityScorecardDataConnectorTestFixtures>({});

test.describe('security scorecard data connector', () => {
  test('Create a new Security Scorecard connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-409',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Security Scorecard connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-410',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Security Scorecard connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-411',
    });

    expect(true).toBeTruthy();
  });
});
