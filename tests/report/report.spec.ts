import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type ReportTestFixtures = {};

const test = base.extend<ReportTestFixtures>({});

test.describe('report', () => {
  test('Create a report via the "Create Report" button on the report home page', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-594',
    });

    expect(true).toBe(true);
  });

  test('Create a report via the "Create Report" button on an app\'s or survey\'s reports home page.', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-595',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-596',
    });

    expect(true).toBe(true);
  });

  test('Update a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-597',
    });

    expect(true).toBe(true);
  });

  test('Delete a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-598',
    });

    expect(true).toBe(true);
  });

  test('Bulk edit records in a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-599',
    });

    expect(true).toBe(true);
  });

  test('Bulk delete records in a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-600',
    });

    expect(true).toBe(true);
  });

  test('Apply liver filters to a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-601',
    });

    expect(true).toBe(true);
  });

  test('Sort a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-602',
    });

    expect(true).toBe(true);
  });

  test('Filter a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-603',
    });

    expect(true).toBe(true);
  });

  test('Export a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-604',
    });

    expect(true).toBe(true);
  });

  test('Print a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-605',
    });

    expect(true).toBe(true);
  });

  test('Add related data to a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-606',
    });

    expect(true).toBe(true);
  });

  test('Schedule a report for export', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-607',
    });

    expect(true).toBe(true);
  });

  test('Configure a bar chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-608',
    });

    expect(true).toBe(true);
  });

  test('Configure a column chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-609',
    });

    expect(true).toBe(true);
  });

  test('Configure a pie chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-610',
    });

    expect(true).toBe(true);
  });

  test('Configure a donut chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-611',
    });

    expect(true).toBe(true);
  });

  test('Configure a line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-612',
    });

    expect(true).toBe(true);
  });

  test('Configure a spline chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-613',
    });

    expect(true).toBe(true);
  });

  test('Configure a funnel chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-614',
    });

    expect(true).toBe(true);
  });

  test('Configure a pyramid chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-615',
    });

    expect(true).toBe(true);
  });

  test('Configure a stacked bar chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-616',
    });

    expect(true).toBe(true);
  });

  test('Configure a column plus line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-617',
    });

    expect(true).toBe(true);
  });

  test('Configure a stacked column chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-618',
    });

    expect(true).toBe(true);
  });

  test('Configure stacked column plus line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-619',
    });

    expect(true).toBe(true);
  });

  test('Configure a bubble chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-620',
    });

    expect(true).toBe(true);
  });

  test('Configure a heat map chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-621',
    });

    expect(true).toBe(true);
  });

  test('Configure a calendar', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-622',
    });

    expect(true).toBe(true);
  });

  test('Configure a gantt chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-623',
    });

    expect(true).toBe(true);
  });

  test('Configure a point map', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-624',
    });

    expect(true).toBe(true);
  });
});
