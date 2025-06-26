import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type BillingReportTestFixtures = {};

const test = base.extend<BillingReportTestFixtures>({});

test.describe('billing report', () => {
  test('Filter the Usage History Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-291',
    });

    expect(true).toBeTruthy();
  });

  test('Export the Detailed Data Usage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-882',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the Detailed Data usage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    expect(true).toBeTruthy();
  });

  test('Export the Detailed File Storage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the Detailed File Storage By App Statistics report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-884',
    });

    expect(true).toBeTruthy();
  });
});
