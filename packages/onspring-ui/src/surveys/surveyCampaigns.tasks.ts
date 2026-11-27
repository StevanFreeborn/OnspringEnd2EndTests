import { Response } from '@playwright/test';
import { SurveyCampaign, SurveyCampaignActionButtons, SurveyCampaignType } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  AddCampaignDialogTargets,
  CopyCampaignDialogTargets,
  DeleteCampaignDialogTargets,
  EditCampaignDialogTargets,
  LaunchCampaignDialogTargets,
  SurveyCampaignsTabTargets,
} from './surveyCampaigns.targets.js';

export type TargetedCampaignNotifierOptions = {
  fromName?: string;
  fromAddressLocalPart?: string;
  subject?: string;
  body?: string;
};

export type EditSurveyCampaignOptions = {
  name?: string;
  endDate?: string;
  archive?: boolean;
  allowPageSkipping?: boolean;
  actionButtons?: SurveyCampaignActionButtons;
  notifier?: TargetedCampaignNotifierOptions;
};

export type CopySurveyCampaignOptions = {
  expectedType?: SurveyCampaignType;
  updatedName?: string;
};

export const SurveyCampaignTasks = {
  add:
    (campaign: SurveyCampaign): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyCampaignsTabTargets.addCampaignLink);

      await actor.browse().waitForState(AddCampaignDialogTargets.continueButton, 'visible');
      await actor.browse().click(AddCampaignDialogTargets.continueButton);

      await actor.browse().waitForState(AddCampaignDialogTargets.nameInput, 'visible');
      await actor.browse().fill(AddCampaignDialogTargets.nameInput, campaign.name);

      await actor.browse().click(AddCampaignDialogTargets.typeDropdown);
      await actor.browse().waitForState(AddCampaignDialogTargets.typeOption(campaign.type), 'visible');
      await actor.browse().click(AddCampaignDialogTargets.typeOption(campaign.type));

      if (campaign.endDate !== undefined) {
        await actor.browse().fill(AddCampaignDialogTargets.endDateInput, campaign.endDate);
      }

      await actor.browse().setChecked(AddCampaignDialogTargets.allowPageSkippingCheckbox, campaign.allowPageSkipping);

      if (campaign.actionButtons?.saveProgress !== undefined) {
        await actor
          .browse()
          .fill(AddCampaignDialogTargets.saveProgressButtonTextInput, campaign.actionButtons.saveProgress);
      }

      if (campaign.actionButtons?.next !== undefined) {
        await actor.browse().fill(AddCampaignDialogTargets.nextButtonTextInput, campaign.actionButtons.next);
      }

      if (campaign.actionButtons?.completeAndSubmit !== undefined) {
        await actor
          .browse()
          .fill(AddCampaignDialogTargets.completeAndSubmitButtonTextInput, campaign.actionButtons.completeAndSubmit);
      }

      if (campaign.actionButtons?.previous !== undefined) {
        await actor.browse().fill(AddCampaignDialogTargets.previousButtonTextInput, campaign.actionButtons.previous);
      }

      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.addStep2PathRegex.test(r.url()) && r.status() === 200
        );

      if (campaign.type === 'Public') {
        const reloadResponse = actor
          .browse()
          .waitForResponse(
            (r: Response) => SurveyCampaignsTabTargets.reloadCampaignsPathRegex.test(r.url()) && r.status() === 200
          );

        await actor.browse().click(AddCampaignDialogTargets.saveButton);
        await saveResponse;
        await reloadResponse;
        await actor.browse().waitForState(AddCampaignDialogTargets.dialog, 'hidden');
        return;
      }

      await actor.browse().click(AddCampaignDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForState(AddCampaignDialogTargets.dialog, 'hidden');
      await actor.browse().waitForState(EditCampaignDialogTargets.iframe, 'attached');
      await actor.browse().waitForState(EditCampaignDialogTargets.dialog, 'visible');
    },

  closeEditDialog:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(EditCampaignDialogTargets.dialog, 'visible');
      await actor.browse().click(EditCampaignDialogTargets.cancelButton);
      await actor.browse().waitForState(EditCampaignDialogTargets.dialog, 'hidden');
    },

  copyFromRow:
    (
      sourceName: string,
      expectedCopyName: string,
      { expectedType = 'Public', updatedName }: CopySurveyCampaignOptions = {}
    ): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SurveyCampaignsTabTargets.campaignRow(sourceName));
      await actor.browse().click(SurveyCampaignsTabTargets.copyButtonInRow(sourceName));

      await actor.browse().waitForState(CopyCampaignDialogTargets.nameInput, 'visible');
      await actor.browse().check(CopyCampaignDialogTargets.nameInput).hasValue(expectedCopyName);
      await actor.browse().check(CopyCampaignDialogTargets.typeDropdown).hasText(expectedType);

      if (updatedName !== undefined) {
        await actor.browse().fill(CopyCampaignDialogTargets.nameInput, updatedName);
      }

      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.addStep2PathRegex.test(r.url()) && r.status() === 200
        );
      const reloadResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.reloadCampaignsPathRegex.test(r.url()) && r.status() === 200
        );

      await actor.browse().click(CopyCampaignDialogTargets.saveButton);
      await saveResponse;
      await reloadResponse;
      await actor.browse().waitForState(CopyCampaignDialogTargets.dialog, 'hidden');
    },

  deletePreLaunch:
    (campaignName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SurveyCampaignsTabTargets.campaignRow(campaignName));
      await actor.browse().click(SurveyCampaignsTabTargets.deleteButtonInRow(campaignName));
      await actor.browse().waitForState(DeleteCampaignDialogTargets.deleteButton, 'visible');

      const deleteResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.deletePathRegex.test(r.url()) && r.status() === 200
        );

      await actor.browse().click(DeleteCampaignDialogTargets.deleteButton);
      await deleteResponse;
      await actor.browse().waitForState(DeleteCampaignDialogTargets.dialog, 'hidden');
      await actor.browse().waitForState(SurveyCampaignsTabTargets.campaignRow(campaignName), 'hidden');
    },

  saveOpenEditDialog:
    (updates: EditSurveyCampaignOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(EditCampaignDialogTargets.nameInput, 'visible');

      if (updates.name !== undefined) {
        await actor.browse().fill(EditCampaignDialogTargets.nameInput, updates.name);
      }

      if (updates.endDate !== undefined) {
        await actor.browse().fill(EditCampaignDialogTargets.endDateInput, updates.endDate);
        await actor.browse().blur(EditCampaignDialogTargets.endDateInput);
      }

      if (updates.archive !== undefined) {
        await actor.browse().setChecked(EditCampaignDialogTargets.archiveCheckbox, updates.archive);
      }

      if (updates.allowPageSkipping !== undefined) {
        await actor.browse().setChecked(EditCampaignDialogTargets.allowPageSkippingCheckbox, updates.allowPageSkipping);
      }

      if (updates.actionButtons?.saveProgress !== undefined) {
        await actor
          .browse()
          .fill(EditCampaignDialogTargets.saveProgressButtonTextInput, updates.actionButtons.saveProgress);
      }

      if (updates.actionButtons?.next !== undefined) {
        await actor.browse().fill(EditCampaignDialogTargets.nextButtonTextInput, updates.actionButtons.next);
      }

      if (updates.actionButtons?.completeAndSubmit !== undefined) {
        await actor
          .browse()
          .fill(EditCampaignDialogTargets.completeAndSubmitButtonTextInput, updates.actionButtons.completeAndSubmit);
      }

      if (updates.actionButtons?.previous !== undefined) {
        await actor.browse().fill(EditCampaignDialogTargets.previousButtonTextInput, updates.actionButtons.previous);
      }

      if (updates.notifier) {
        await actor.attemptsTo(SurveyCampaignTasks.openEditNotifierTab());

        if (updates.notifier.fromName !== undefined) {
          await actor.browse().fill(EditCampaignDialogTargets.fromNameInput, updates.notifier.fromName);
        }

        if (updates.notifier.fromAddressLocalPart !== undefined) {
          await actor
            .browse()
            .fill(EditCampaignDialogTargets.fromAddressLocalPartInput, updates.notifier.fromAddressLocalPart);
        }

        if (updates.notifier.subject !== undefined) {
          await actor.browse().fill(EditCampaignDialogTargets.subjectInput, updates.notifier.subject);
        }

        if (updates.notifier.body !== undefined) {
          await actor.browse().click(EditCampaignDialogTargets.notifierBodyEditor);
          await actor.browse().fill(EditCampaignDialogTargets.notifierBodyEditor, updates.notifier.body);
        }
      }

      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.editSavePathRegex.test(r.url()) && r.status() === 200
        );
      const reloadResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveyCampaignsTabTargets.reloadCampaignsPathRegex.test(r.url()) && r.status() === 200
        );

      await actor.browse().click(EditCampaignDialogTargets.saveButton);
      await saveResponse;
      await reloadResponse;
      await actor.browse().waitForState(EditCampaignDialogTargets.dialog, 'hidden');
    },

  openEditDialog:
    (campaignName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SurveyCampaignsTabTargets.campaignRow(campaignName));
      await actor.browse().click(SurveyCampaignsTabTargets.editButtonInRow(campaignName));
      await actor.browse().waitForState(EditCampaignDialogTargets.nameInput, 'visible');
    },

  openEditNotifierTab:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditCampaignDialogTargets.notifierTab);
      await actor.browse().waitForState(EditCampaignDialogTargets.fromNameInput, 'visible');
    },

  edit:
    (campaignName: string, updates: EditSurveyCampaignOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        SurveyCampaignTasks.openEditDialog(campaignName),
        SurveyCampaignTasks.saveOpenEditDialog(updates)
      );
    },

  launchTargetedCampaign:
    (campaignName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
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
      await actor
        .browse()
        .check(LaunchCampaignDialogTargets.content)
        .containsText('The Survey Campaign has been launched.');
      await actor.browse().click(LaunchCampaignDialogTargets.closeButton);
      await actor.browse().waitForState(LaunchCampaignDialogTargets.dialog, 'hidden');
    },

  endAndArchive:
    (campaignName: string, pastEndDate: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // Save past End Date first so campaign moves Running -> Complete and Archive checkbox becomes enabled.
      await actor.attemptsTo(SurveyCampaignTasks.edit(campaignName, { endDate: pastEndDate }));
      await actor.attemptsTo(SurveyCampaignTasks.edit(campaignName, { archive: true }));
    },

  setHideArchived:
    (hide: boolean): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().setChecked(SurveyCampaignsTabTargets.hideArchivedCheckbox, hide);
    },
};
