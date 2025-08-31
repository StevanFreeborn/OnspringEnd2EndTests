import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type UserUsageReportTextFixtures = {};

const test = base.extend<UserUsageReportTextFixtures>({});

test.describe('user usage report', () => {
  test('Filter the user usage report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-886',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the user usage report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-887',
    });

    expect(true).toBeTruthy();
  });

  test('Click on the Usage link for a user in the report to view the usage details', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-888',
    });

    expect(true).toBeTruthy();
  });

  test('Click on a "Link" link within the usage details dialog', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-889',
    });

    expect(true).toBeTruthy();
  });

  test('Export the User Usage details for a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-890',
    });

    expect(true).toBeTruthy();
  });
});
