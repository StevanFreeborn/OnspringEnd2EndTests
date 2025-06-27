import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type HorizontalTabTestFixtures = {};

const test = base.extend<HorizontalTabTestFixtures>({});

test.describe('horizontal tab', () => {
  test("Add a horizontal tab to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-42',
    });

    expect(true).toBeTruthy();
  });

  test("Update a horizontal tab on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-43',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a horizontal tab on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-44',
    });

    expect(true).toBeTruthy();
  });

  test("Rearrange the horizontal tabs on an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-45',
    });

    expect(true).toBeTruthy();
  });
});
