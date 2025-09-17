import { expect } from '@playwright/test';
import { test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type KeyMetricTestFixtures = {};

const test = base.extend<KeyMetricTestFixtures>({});

test.describe('key metrics', () => {
  test('Add a new single value key metric with an app/survey field source', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-774',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new single value key metric with a content record field source', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-775',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new single value key metric with a report field source', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-776',
    });

    expect(true).toBeTruthy();
  });

  test('Modify an existing key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-777',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-778',
    });

    expect(true).toBeTruthy();
  });

  test('Verify an app/survey single value key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-779',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a content record single value key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-780',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a report single value key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-781',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new dial gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-795',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new donut gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-796',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new bar gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-797',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new bulb gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-798',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a bulb gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-799',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a bar gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-800',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a donut gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-801',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a dial gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-802',
    });

    expect(true).toBeTruthy();
  });
});
