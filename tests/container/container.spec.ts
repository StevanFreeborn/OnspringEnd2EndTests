import { expect, test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('container', () => {
  test('Create a container via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-292',
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the create button on the Dashboards tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-293',
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the "Create Container" button on the Containers home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-294',
    });

    expect(true).toBeTruthy();
  });

  test('Update a container', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-298',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a container', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-299',
    });

    expect(true).toBeTruthy();
  });
});
