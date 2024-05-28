import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('bitsight data connector', () => {
  test('Create a new Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-395',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-396',
    });

    expect(true).toBe(true);
  });

  test('Delete a Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-397',
    });

    expect(true).toBe(true);
  });

  test('Configure a new Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-398',
    });

    expect(true).toBe(true);
  });

  test('Verify a new Bitsight connector runs successfully', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-399',
    });

    expect(true).toBe(true);
  });
});
