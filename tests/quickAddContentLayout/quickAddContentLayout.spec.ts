import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type QuickAddContentLayoutTestFixtures = {};

const test = base.extend<QuickAddContentLayoutTestFixtures>({});

test.describe('quick add content layout', () => {
  test("Enable an app's quick add content layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-30',
    });

    expect(true).toBeTruthy();
  });

  test("Disable an app's quick add content layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-31',
    });

    expect(true).toBeTruthy();
  });
});
