import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend({});

test.describe('attachment question', function () {
  test('Create an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-274',
    });

    // TODO: implement this test
    // create the survey
    // navigate to the designer
    // create an attachment questions
    // complete required fields then leave defaults as is
    // preview the survey...surveys auto save so might need to
    // detect the save and wait for it to complete before previewing
    // confirm the attachment question is present
    expect(false).toBe(true);
  });

  test('Create a copy of an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-275',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Import an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-276',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Update an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-277',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question on a page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-278',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Move an attachment question to another page', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-279',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });

  test('Delete an attachment question', function () {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-312',
    });

    // TODO: implement this test
    expect(false).toBe(true);
  });
});
