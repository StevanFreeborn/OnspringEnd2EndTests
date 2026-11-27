import { FakeDataFactory, Survey, SurveyCampaign } from '@stevanfreeborn/onspring-models';
import {
  SurveyCampaignQuestions,
  SurveyCampaignsTabTargets,
  SurveyCampaignTasks,
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
});
