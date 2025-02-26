import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('automated email message sources report', () => {
  test('Filter the Automated Email Message Sources Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-282',
    });

    await test.step('Create an email body', async () => {});

    await test.step('Navigate to the automated email message sources report', async () => {});

    await test.step('Filter the automated email message sources report', async () => {});

    await test.step('Verify the automated email message sources report is filtered', async () => {});

    expect(true).toBeTruthy();
  });

  test('Edit an item in the Automated Email Message Sources Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-284',
    });

    await test.step('Create an email body', async () => {});

    await test.step('Navigate to the automated email message sources report', async () => {});

    await test.step('Edit the email body from the automated email message sources report', async () => {});

    await test.step('Verify the email body was edited', async () => {});
    
    expect(true).toBeTruthy();
  });

  test('Sort the Automated Email Message Sources Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-313',
    });

    await test.step('Create two email bodies', async () => {});

    await test.step('Navigate to the automated email message sources report', async () => {});

    await test.step('Sort the automated email message sources report', async () => {});

    await test.step('Verify the automated email message sources report is sorted', async () => {});

    expect(true).toBeTruthy();
  });
});
