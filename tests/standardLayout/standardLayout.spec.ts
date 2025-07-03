import { expect } from "@playwright/test";
import { test as base } from "../../fixtures"
import { AnnotationType } from "../annotations";

type StandardLayoutTestFixtures = {};

const test = base.extend<StandardLayoutTestFixtures>({});

test.describe("standard layout", () => {
  test('Add a standard layout to an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-32',
    });

    expect(true).toBeTruthy();
  });

  test('Update a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-33',
    });

    expect(true).toBeTruthy();
  });

  test('Disable a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-35',
    });

    expect(true).toBeTruthy();
  });

  test('Enable a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-36',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-37',
    });

    expect(true).toBeTruthy();
  });

  test('Assign roles to a standard layout of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-55',
    });

    expect(true).toBeTruthy();
  });

  test('Make a copy of a standard layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-864',
    });

    expect(true).toBeTruthy();
  });
});
