import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('email template', () => {
  test('Create an Email Template via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-380',
    });

    expect(true).toBeTruthy();
  });

  test('Create an Email Template via the create button on the Messaging tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-381',
    });

    expect(true).toBeTruthy();
  });

  test('Create an Email Template via the "Create Email Template" button on the email template home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-382',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Template via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-383',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Template via the create button on the Messaging tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-384',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Template via the "Create Email Template" button on the email templates home page.', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-385',
    });

    expect(true).toBeTruthy();
  });

  test('Update an email template', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-386',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an email template', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-387',
    });

    expect(true).toBeTruthy();
  });
});
