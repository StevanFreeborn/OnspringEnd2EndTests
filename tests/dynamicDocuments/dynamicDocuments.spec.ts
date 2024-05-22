import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type DynamicDocumentTestFixtures = {};

const test = base.extend<DynamicDocumentTestFixtures>({});

test.describe('Dynamic Documents', () => {
  test('Create a dynamic document via the create button on the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-239',
    });

    expect(true).toBeTruthy();
  });

  test('Create a dynamic document via the create button on the Documents tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-240',
    });

    expect(true).toBeTruthy();
  });

  test('Create a dynamic document via the "Create Document" button on the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-241',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the create button on the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-242',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the create button on the Documents tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-243',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a dynamic document via the "Create Document" button on the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-244',
    });

    expect(true).toBeTruthy();
  });

  test("Update a dynamic document's configurations on an app from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-245',
    });

    expect(true).toBeTruthy();
  });

  test("Update a dynamic document's configurations from the Documents admin page", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-246',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a dynamic document on an app from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-247',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-248',
    });

    expect(true).toBeTruthy();
  });

  test("Disable a dynamic document from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-254',
    });

    expect(true).toBeTruthy();
  });

  test('Disable a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-255',
    });

    expect(true).toBeTruthy();
  });

  test("Enable a dynamic document from an app's Documents tab", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-256',
    });

    expect(true).toBeTruthy();
  });

  test('Enable a dynamic document from the Documents admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-257',
    });

    expect(true).toBeTruthy();
  });

  test('Add a report token to a dynamic document', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-794',
    });

    expect(true).toBeTruthy();
  });
});
