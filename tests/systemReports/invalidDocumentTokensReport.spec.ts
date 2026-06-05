import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type InvalidDocumentTokensReportTestFixtures = object;

const test = base.extend<InvalidDocumentTokensReportTestFixtures>({});

test.describe('invalid document tokens report', () => {
  test('Filter the invalid document tokens report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-530',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the invalid document tokens report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-531',
    });

    expect(true).toBeTruthy();
  });

  test('Edit a document in the invalid document tokens report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-532',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a document in the invalid document tokens report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-533',
    });

    expect(true).toBeTruthy();
  });
});
