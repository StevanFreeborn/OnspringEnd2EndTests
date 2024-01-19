import { test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('attachment question', function () {
  test('Create an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-274',
    });
  });

  test('Create a copy of an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-275',
    });
  });

  test('Import an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });
  });

  test('Update an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });
  });

  test('Move an attachment question on a page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-278',
    });
  });

  test('Move an attachment question to another page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });
  });

  test('Delete an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });
  });
});
