import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { SurveysAdminPage } from '../../pageObjectModels/surveys/surveysAdminPage';
import { AnnotationType } from '../annotations';

type SurveyTestFixtures = {
  adminHomePage: AdminHomePage;
  surveysAdminPage: SurveysAdminPage;
};

const test = base.extend<SurveyTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  surveysAdminPage: async ({ sysAdminPage }, use) => {
    const surveysAdminPage = new SurveysAdminPage(sysAdminPage);
    await use(surveysAdminPage);
  },
});

test.describe('survey supporting data app', () => {
  let surveysToDelete: string[] = [];

  test.beforeEach(async () => {
    // await surveysAdminPage.goto();
  });

  test.afterEach(async () => {
    // await surveysAdminPage.deleteSurveys(surveysToDelete);
    surveysToDelete = [];
  });

  test('Create a survey via the create button on the header of on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-858',
    });

    const surveyName = FakeDataFactory.createFakeSurveyName();
    surveysToDelete.push(surveyName);

    await test.step('Create the survey', async () => {});

    await test.step('Verify the survey was created correctly', async () => {});

    expect(false).toBe(true);
  });

  test('Create a survey via the create button on the Surveys tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-859',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a survey via the "Create Survey" button on the Surveys admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-860',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a survey via the create button on the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-861',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a survey via the "Create Survey" button on the Surveys admin page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-862',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a survey via the create button on the Surveys tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-863',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's name", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-696',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Disable a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-697',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Enable a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-698',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's description", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-699',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Disable a survey supporting data app's content versioning", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-700',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Enable a survey supporting data app's content versioning", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-701',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Change the save types of a survey supporting data app's content versioning", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-702',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Disable a survey supporting data app's concurrent edit alert", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-703',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Enable a survey supporting data app's concurrent edit alert", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-704',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data's display link field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-705',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's integration link field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-706',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's display fields", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-707',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's primary sort field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-708',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's secondary sort field", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-709',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Change a survey supporting data app's administration permissions to private", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-710',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific users', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-711',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific roles', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-712',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Give survey supporting data app administration permissions to specific groups', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-713',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Change a survey supporting data app's administration permissions to public", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-714',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Enable geocoding for a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-715',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's geocoding field mapping", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-716',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Disable geocoding for a survey supporting data app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-717',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Update a survey supporting data app's survey notes", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-718',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });
});
