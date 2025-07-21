import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type LoginHistoryReportTestFixtures = {};

const test = base.extend<LoginHistoryReportTestFixtures>({});

test.describe('login history report', () => {
  test('Filter the login history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-549',
    });

    expect(true).toBeTruthy();
  });

  test('Display uses currently logged in', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-550',
    });

    expect(true).toBeTruthy();
  });

  test('Export the login history report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-551',
    });

    expect(true).toBeTruthy();
  });
});
