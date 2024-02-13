import { expect, surveyQuestionTest as test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('survey design', () => {
  test("Preview a survey's design", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-656',
    });

    await test.step('Navigate to the survey admin page', async () => {});

    await test.step('Open the survey designer', () => {});

    await test.step('Add a question to the survey', () => {});

    await test.step('Add a thank you message to the thank you page', () => {});

    await test.step('Preview the survey and complete and submit it', () => {});

    expect(true).toBeTruthy();
  });
});
