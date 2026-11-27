import { FakeDataFactory, Survey, SurveyCampaign, TextQuestion } from '@stevanfreeborn/onspring-models';
import {
  EditCampaignDialogTargets,
  PublicSurveyPageTargets,
  SurveyCampaignQuestions,
  SurveyCampaignsTabTargets,
  SurveyCampaignTasks,
  SurveyDesignerTasks,
  SurveyTasks,
} from '@stevanfreeborn/onspring-ui';
import { test as base, expect, SurveyFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ targetSurvey: Survey }>({
  targetSurvey: SurveyFixture.create().build(),
});

test.describe('public campaign', () => {
  test('Add a new public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-678',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });

    await test.step('Open the survey campaigns tab', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id));
    });

    await test.step('Add a new public campaign', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.add(campaign));
    });

    await test.step('Verify the public campaign appears in the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Public'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Pre-Launch'))
        .isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.testButtonInRow(campaign.name)).isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.launchButtonInRow(campaign.name)).isVisible();
    });
  });

  test('Copy an existing public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-679',
    });

    const sourceCampaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });
    const expectedCopyName = `${sourceCampaign.name} (1)`;

    await test.step('Create an existing public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(sourceCampaign)
      );
    });

    await test.step('Copy the public campaign from the grid row action', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.copyFromRow(sourceCampaign.name, expectedCopyName));
    });

    await test.step('Verify the copied public campaign appears in the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(expectedCopyName)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(expectedCopyName, 'Public'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(expectedCopyName, 'Pre-Launch'))
        .isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.testButtonInRow(expectedCopyName)).isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.launchButtonInRow(expectedCopyName)).isVisible();
    });
  });

  test('Delete a pre-launched public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-680',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });

    await test.step('Create a pre-launched public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign)
      );
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isVisible();
    });

    await test.step('Delete the pre-launched public campaign', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.deletePreLaunch(campaign.name));
    });

    await test.step('Verify the deleted campaign is removed from the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isHidden();
    });
  });

  test('Modify an existing public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-681',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });
    const updatedName = FakeDataFactory.createFakeSurveyCampaignName();

    await test.step('Create a public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign)
      );
    });

    await test.step('Modify campaign settings', async () => {
      await sysAdminActor.attemptsTo(
        SurveyCampaignTasks.edit(campaign.name, {
          name: updatedName,
          allowPageSkipping: false,
          actionButtons: {
            saveProgress: 'Save Draft',
            next: 'Forward',
          },
        })
      );
    });

    await test.step('Verify the updated campaign name and persisted settings', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(updatedName)).isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isHidden();

      await sysAdminActor.attemptsTo(SurveyCampaignTasks.openEditDialog(updatedName));
      try {
        await sysAdminActor.browse().check(EditCampaignDialogTargets.nameInput).hasValue(updatedName);
        await sysAdminActor.browse().check(EditCampaignDialogTargets.allowPageSkippingCheckbox).isNotChecked();
        await sysAdminActor
          .browse()
          .check(EditCampaignDialogTargets.saveProgressButtonTextInput)
          .hasValue('Save Draft');
        await sysAdminActor.browse().check(EditCampaignDialogTargets.nextButtonTextInput).hasValue('Forward');
      } finally {
        await sysAdminActor.attemptsTo(SurveyCampaignTasks.closeEditDialog());
      }
    });
  });

  test('Verify a public campaign in test mode', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-682',
    });

    const question = createFakeTextQuestion();
    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });

    await test.step('Add a question to the survey and create a public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner(),
        SurveyDesignerTasks.addQuestion(question),
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign)
      );
    });

    await test.step('Open the test campaign view and verify test mode banner and question', async () => {
      const testActor = await sysAdminActor.asks(SurveyCampaignQuestions.openTestCampaign(campaign.name));

      try {
        await testActor.browse().checkPage().hasUrl(PublicSurveyPageTargets.testPathRegex);
        await testActor
          .browse()
          .check(PublicSurveyPageTargets.testModeBanner)
          .hasText(PublicSurveyPageTargets.testModeBannerText);
        await testActor.browse().check(PublicSurveyPageTargets.questionText(question.questionText)).isVisible();
      } finally {
        await testActor.browse().close();
      }
    });
  });

  test('Launch a public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-683',
    });

    const question = createFakeTextQuestion();
    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });

    await test.step('Add a question to the survey and create a public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner(),
        SurveyDesignerTasks.addQuestion(question),
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign)
      );
    });

    let publicUrl = '';

    await test.step('Launch the public campaign and capture its generated URL', async () => {
      publicUrl = await sysAdminActor.asks(SurveyCampaignQuestions.launchPublicCampaign(campaign.name));
      expect(publicUrl).toMatch(PublicSurveyPageTargets.publicPathRegex);
    });

    await test.step('Verify running state and row controls after launch', async () => {
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Running'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.viewResponseReportLinkInRow(campaign.name))
        .isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.launchButtonInRow(campaign.name)).isHidden();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.deleteButtonInRow(campaign.name)).isHidden();
    });

    await test.step('Open the generated public URL and verify the live survey renders', async () => {
      await sysAdminActor.browse().goto(publicUrl);
      await sysAdminActor.browse().check(PublicSurveyPageTargets.questionText(question.questionText)).isVisible();
      await sysAdminActor.browse().check(PublicSurveyPageTargets.testModeBanner).isHidden();
    });
  });

  test('Archive a public campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-684',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Public',
    });
    const pastEndDate = getPastCampaignDateString();

    await test.step('Create and launch a public campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign)
      );
      await sysAdminActor.asks(SurveyCampaignQuestions.launchPublicCampaign(campaign.name));
    });

    await test.step('End the campaign with a past date and archive it', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.endAndArchive(campaign.name, pastEndDate));
    });

    await test.step('Verify the archived campaign is hidden by default and visible when showing archived', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isHidden();

      await sysAdminActor.attemptsTo(SurveyCampaignTasks.setHideArchived(false));
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Complete (Archived)'))
        .isVisible();
    });
  });
});

function createFakeTextQuestion(): TextQuestion {
  const questionId = FakeDataFactory.createFakeQuestionId();
  return new TextQuestion({
    questionId,
    questionText: questionId,
  });
}

function getPastCampaignDateString(): string {
  const yesterday = new Date(Date.now() - 86_400_000);
  return `${yesterday.getMonth() + 1}/${yesterday.getDate()}/${yesterday.getFullYear()} 12:00 AM`;
}
