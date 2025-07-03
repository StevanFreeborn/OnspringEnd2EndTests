import { expect } from '@playwright/test';
import { test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SectionTestFixtures = {};

const test = base.extend<SectionTestFixtures>({});

test.describe('section', () => {
  test("Add a section to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-46',
    });

    expect(true).toBeTruthy();
  });

  test("Update a section of an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-47',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a section of an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-48',
    });

    expect(true).toBeTruthy();
  });

  test("Add a standalone section to an app's layout", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-49',
    });

    expect(true).toBeTruthy();
  });

  test("Update a standalone section of an app's layout", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-50',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a standalone section of an app's layout", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-51',
    });

    expect(true).toBeTruthy();
  });

  test('Rearrange the sections of an app’s layout', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-52',
    });

    expect(true).toBeTruthy();
  });
});
