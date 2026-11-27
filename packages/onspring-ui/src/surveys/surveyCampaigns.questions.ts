import { Response } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  EditCampaignDialogTargets,
  LaunchCampaignDialogTargets,
  SurveyCampaignsTabTargets,
} from './surveyCampaigns.targets.js';

export type SurveyCampaignEditState = {
  name: string;
  endDate: string;
  archived: boolean;
  allowPageSkipping: boolean;
  saveProgressButtonText: string;
  nextButtonText: string;
  completeAndSubmitButtonText: string;
  previousButtonText: string;
};

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
      const urlMatch = /https:\/\/\S+/.exec(dialogText);

      if (!urlMatch) {
        throw new Error(`Could not extract public survey URL from Campaign Launch dialog: "${dialogText}"`);
      }

      await actor.browse().click(LaunchCampaignDialogTargets.closeButton);
      await actor.browse().waitForState(LaunchCampaignDialogTargets.dialog, 'hidden');

      return urlMatch[0];
    },

  campaignEditState:
    (campaignName: string): Question<WebActor, SurveyCampaignEditState> =>
    async (actor: WebActor): Promise<SurveyCampaignEditState> => {
      await actor.browse().hover(SurveyCampaignsTabTargets.campaignRow(campaignName));
      await actor.browse().click(SurveyCampaignsTabTargets.editButtonInRow(campaignName));
      await actor.browse().waitForState(EditCampaignDialogTargets.nameInput, 'visible');

      const state: SurveyCampaignEditState = {
        name: await actor.browse().inputValue(EditCampaignDialogTargets.nameInput),
        endDate: await actor.browse().inputValue(EditCampaignDialogTargets.endDateInput),
        archived: await actor.browse().isChecked(EditCampaignDialogTargets.archiveCheckbox),
        allowPageSkipping: await actor.browse().isChecked(EditCampaignDialogTargets.allowPageSkippingCheckbox),
        saveProgressButtonText: await actor.browse().inputValue(EditCampaignDialogTargets.saveProgressButtonTextInput),
        nextButtonText: await actor.browse().inputValue(EditCampaignDialogTargets.nextButtonTextInput),
        completeAndSubmitButtonText: await actor
          .browse()
          .inputValue(EditCampaignDialogTargets.completeAndSubmitButtonTextInput),
        previousButtonText: await actor.browse().inputValue(EditCampaignDialogTargets.previousButtonTextInput),
      };

      await actor.browse().click(EditCampaignDialogTargets.cancelButton);
      await actor.browse().waitForState(EditCampaignDialogTargets.dialog, 'hidden');

      return state;
    },
};
