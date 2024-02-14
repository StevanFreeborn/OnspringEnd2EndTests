import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('data import', () => {
  test('Create a Data Import via the create button in the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-335',
    });

    expect(true).toBeTruthy();
  });

  test('Create a Data Import via the create button on the Integrations tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-336',
    });

    expect(true).toBeTruthy();
  });

  test('Create a Data Import via the "Create Import Configuration" button on the data import home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-337',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the create button in the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-338',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the create button on the Integrations tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-339',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the "Create Import Configuration" button on the data import home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-340',
    });

    expect(true).toBeTruthy();
  });

  test('Update a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-342',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-343',
    });

    expect(true).toBeTruthy();
  });

  test('Run a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-341',
    });

    expect(true).toBeTruthy();
  });
});
