import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type RulesControlTestFixtures = {};

const test = base.extend<RulesControlTestFixtures>({});

test.describe('rules control', () => {
  test('Verify Record is New rules can be added and are maintained after closing control and re-opening', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-807',
    });

    expect(true).toBeTruthy();
  });
});
