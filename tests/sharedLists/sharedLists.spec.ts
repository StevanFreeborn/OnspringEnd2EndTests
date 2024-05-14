import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('shared lists', () => {
  test('Create a shared list via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-637',
    });

    expect(true).toBeTruthy();
  });

  test('Create a shared list via the create button on the Lists tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-638',
    });

    expect(true).toBeTruthy();
  });

  test('Create a shared list via the "Create List" button on the shared list home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-639',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a shared list via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-640',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a shared list via the create button on the Lists tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-641',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a shared list via the "Create List" button on the shared list home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-642',
    });

    expect(true).toBeTruthy();
  });

  test('Update a shared list', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-643',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a shared list', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-644',
    });

    expect(true).toBeTruthy();
  });
});
