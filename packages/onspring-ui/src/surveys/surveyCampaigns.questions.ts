import { Response } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  EditCampaignDialogTargets,
  LaunchCampaignDialogTargets,
  SurveyCampaignsTabTargets,
} from './surveyCampaigns.targets.js';

export const SurveyCampaignQuestions = {
  openTestCampaign:
    (campaignName: string): Question<WebActor, WebActor> =>
    async (actor: WebActor): Promise<WebActor> =>
      actor.browse().clickAndOpenNewTab(SurveyCampaignsTabTargets.testButtonInRow(campaignName), 'TestCampaign'),

  idFromEditDialog:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const src = await actor.browse().getAttribute(EditCampaignDialogTargets.iframe, 'src');
      const match = src?.match(EditCampaignDialogTargets.editDialogPathRegex);

      if (!match) {
        throw new Error(`Expected campaign edit dialog source "${src ?? ''}" to contain a campaign ID.`);
      }

      return parseInt(match[1], 10);
    },

  launchPublicCampaign:
    (campaignName: string): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      await actor.browse().click(SurveyCampaignsTabTargets.launchButtonInRow(campaignName));
      await actor.browse().waitForState(LaunchCampaignDialogTargets.launchButton, 'visible');

      const launchResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.launchPathRegex.test(r.url()) && r.status() === 200
        );
      const reloadResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.reloadCampaignsPathRegex.test(r.url()) && r.status() === 200
        );

      await actor.browse().click(LaunchCampaignDialogTargets.launchButton);
      await launchResponse;
      await reloadResponse;

      await actor.browse().waitForState(LaunchCampaignDialogTargets.closeButton, 'visible');
      const dialogText = await actor.browse().getText(LaunchCampaignDialogTargets.content);

      await actor.browse().click(LaunchCampaignDialogTargets.closeButton);
      await actor.browse().waitForState(LaunchCampaignDialogTargets.dialog, 'hidden');

      const urlMatch = /https:\/\/\S+/.exec(dialogText);

      if (!urlMatch) {
        throw new Error(`Could not extract public survey URL from Campaign Launch dialog: "${dialogText}"`);
      }

      return urlMatch[0];
    },
};
