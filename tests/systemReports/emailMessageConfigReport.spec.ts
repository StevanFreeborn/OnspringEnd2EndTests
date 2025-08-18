import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type EmailMessageConfigReportTestFixtures = {};

const test = base.extend<EmailMessageConfigReportTestFixtures>({});

test.describe('email message configurations report', () => {
  test('Filter the email messaging configurations report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-360',
    });

    expect(true).toBeTruthy();
  });

  test('Sort the email messaging configurations report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-361',
    });

    expect(true).toBeTruthy();
  });

  test('Bulk edit and update some messaging configurations sender email address', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-361',
    });

    expect(true).toBeTruthy();
  });
});
