import { test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SlackMessageTestFixtures = {};

const test = base.extend<SlackMessageTestFixtures>({});

test.describe('slack message', () => {
  test("Add Slack Message to an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-229',
    });

    expect(true).toBeTruthy();
  });

  test("Create a copy of a Slack Message on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-230',
    });

    expect(true).toBeTruthy();
  });

  test('Add Slack Message to an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-231',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Slack Message on an app from the Create button in the admin header', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-232',
    });

    expect(true).toBeTruthy();
  });

  test('Add Slack Message to an app from the Create Slack Message button on the slack message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-233',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Slack Message on an app from the Create Slack Message button on the slack message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-234',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Slack Message's configurations on an app from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-235',
    });

    expect(true).toBeTruthy();
  });

  test("Update a Slack Message's configurations on an app from the Slack Message page", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-236',
    });

    expect(true).toBeTruthy();
  });

  test("Delete a Slack Message from an app's Messaging tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-237',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Slack Message from the Slack Message page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-238',
    });

    expect(true).toBeTruthy();
  });
});
