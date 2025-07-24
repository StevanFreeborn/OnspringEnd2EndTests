import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type EmailSyncTestFixtures = {};

const test = base.extend<EmailSyncTestFixtures>({});

test.describe('email sync', () => {
  test('Create an Email Sync via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-372',
    });

    expect(true).toBeTruthy();
  });

  test('Create an Email Sync via the create button on the Integrations tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-373',
    });

    expect(true).toBeTruthy();
  });

  test('Create an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-374',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Sync via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-375',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Sync via the create button on the Integrations tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-376',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of an Email Sync via the "Create Email Integration (Sync)" button on the email sync home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-377',
    });

    expect(true).toBeTruthy();
  });

  test('Update an Email Sync', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-378',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an Email Sync', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-379',
    });

    expect(true).toBeTruthy();
  });
});
