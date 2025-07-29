import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type RegologyDataConnectorTestFixtures = {};

const test = base.extend<RegologyDataConnectorTestFixtures>({});

test.describe('regology data connector', () => {
  test('Create a new Regology connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-846',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Regology connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-847',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Regology connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-848',
    });

    expect(true).toBeTruthy();
  });
});
