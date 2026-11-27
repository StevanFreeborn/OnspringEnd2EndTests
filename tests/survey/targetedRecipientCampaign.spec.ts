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

test.describe('targeted recipient campaign', () => {
  test('Add a new targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-685',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });

    await test.step('Open the survey campaigns tab', async () => {
      await sysAdminActor.attemptsTo(SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id));
    });

    await test.step('Add a new targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.add(campaign));
      campaign.id = await sysAdminActor.asks(SurveyCampaignQuestions.idFromEditDialog());
      expect(campaign.id).toBeGreaterThan(0);
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.closeEditDialog());
    });

    await test.step('Verify the targeted recipient campaign appears in the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Targeted Recipients'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Pre-Launch'))
        .isVisible();
    });
  });

  test('Copy an existing targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-686',
    });

    const sourceCampaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });
    const expectedCopyName = `${sourceCampaign.name} (1)`;

    await test.step('Create an existing targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(sourceCampaign),
        SurveyCampaignTasks.closeEditDialog()
      );
    });

    await test.step('Copy the targeted recipient campaign from the grid row action', async () => {
      await sysAdminActor.attemptsTo(
        SurveyCampaignTasks.copyFromRow(sourceCampaign.name, expectedCopyName, {
          expectedType: 'Targeted Recipients',
        }),
        SurveyCampaignTasks.closeEditDialog()
      );
    });

    await test.step('Verify the copied targeted recipient campaign appears in the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(expectedCopyName)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(expectedCopyName, 'Targeted Recipients'))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(expectedCopyName, 'Pre-Launch'))
        .isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.testButtonInRow(expectedCopyName)).isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.launchButtonInRow(expectedCopyName)).isVisible();
    });
  });

  test('Delete a pre-launched targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-687',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });

    await test.step('Create a pre-launched targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign),
        SurveyCampaignTasks.closeEditDialog()
      );
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(SurveyCampaignsTabTargets.campaignRowCell(campaign.name, 'Pre-Launch'))
        .isVisible();
    });

    await test.step('Delete the pre-launched targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.deletePreLaunch(campaign.name));
    });

    await test.step('Verify the deleted campaign is removed from the campaigns grid', async () => {
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.campaignRow(campaign.name)).isHidden();
    });
  });

  test('Modify an existing targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-688',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });
    const updatedName = FakeDataFactory.createFakeSurveyCampaignName();
    const updatedSubject = `Subject ${FakeDataFactory.createUniqueIdentifier()}`;
    const updatedBody = `Body ${FakeDataFactory.createUniqueIdentifier()}`;

    await test.step('Create a targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign),
        SurveyCampaignTasks.closeEditDialog()
      );
    });

    await test.step('Modify campaign general settings and notifier fields', async () => {
      await sysAdminActor.attemptsTo(
        SurveyCampaignTasks.edit(campaign.name, {
          name: updatedName,
          allowPageSkipping: false,
          actionButtons: {
            saveProgress: 'Save Draft',
            next: 'Forward',
          },
          notifier: {
            fromName: 'QA Automation',
            fromAddressLocalPart: 'noreply',
            subject: updatedSubject,
            body: updatedBody,
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

        await sysAdminActor.attemptsTo(SurveyCampaignTasks.openEditNotifierTab());
        await sysAdminActor.browse().check(EditCampaignDialogTargets.fromNameInput).hasValue('QA Automation');
        await sysAdminActor.browse().check(EditCampaignDialogTargets.fromAddressLocalPartInput).hasValue('noreply');
        await sysAdminActor.browse().check(EditCampaignDialogTargets.subjectInput).hasValue(updatedSubject);
        await sysAdminActor.browse().check(EditCampaignDialogTargets.notifierBodyEditor).hasText(updatedBody);
      } finally {
        await sysAdminActor.attemptsTo(SurveyCampaignTasks.closeEditDialog());
      }
    });
  });

  test('Verify a targeted recipient campaign in test mode', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-689',
    });

    const question = createFakeTextQuestion();
    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });

    await test.step('Add a question to the survey and create a targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyDesignTab(targetSurvey.id),
        SurveyTasks.openSurveyDesigner(),
        SurveyDesignerTasks.addQuestion(question),
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign),
        SurveyCampaignTasks.closeEditDialog()
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

  test('Launch a targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-690',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });

    await test.step('Create a targeted recipient campaign and configure its required notifier settings', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign),
        SurveyCampaignTasks.saveOpenEditDialog({
          notifier: {
            fromName: 'QA Automation',
            fromAddressLocalPart: 'noreply',
            subject: 'Please complete your survey',
            body: 'Survey invitation body.',
          },
        })
      );
    });

    await test.step('Launch the targeted recipient campaign and verify confirmation message', async () => {
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.launchTargetedCampaign(campaign.name));
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
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.testButtonInRow(campaign.name)).isVisible();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.launchButtonInRow(campaign.name)).isHidden();
      await sysAdminActor.browse().check(SurveyCampaignsTabTargets.deleteButtonInRow(campaign.name)).isHidden();
    });
  });

  test('Archive a targeted recipient campaign', async ({ sysAdminActor, targetSurvey }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-691',
    });

    const campaign = new SurveyCampaign({
      name: FakeDataFactory.createFakeSurveyCampaignName(),
      type: 'Targeted Recipients',
    });
    const pastEndDate = getPastCampaignDateString();

    await test.step('Create and launch a targeted recipient campaign', async () => {
      await sysAdminActor.attemptsTo(
        SurveyTasks.gotoSurveyCampaignsTab(targetSurvey.id),
        SurveyCampaignTasks.add(campaign),
        SurveyCampaignTasks.saveOpenEditDialog({
          notifier: {
            fromName: 'QA Automation',
            fromAddressLocalPart: 'noreply',
            subject: 'Please complete your survey',
            body: 'Survey invitation body.',
          },
        })
      );
      await sysAdminActor.attemptsTo(SurveyCampaignTasks.launchTargetedCampaign(campaign.name));
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
