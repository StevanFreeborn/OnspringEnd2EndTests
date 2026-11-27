import { Locator, Page } from '@playwright/test';
import { SurveyCampaignType } from '@stevanfreeborn/onspring-models';
import { Target } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from '../common/controls/frameOwner.js';

export const SurveyCampaignsTabTargets = {
  addStep2PathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/AddStep2/,
  reloadCampaignsPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/ReloadCampaigns/,
  deletePathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/Delete/,
  editPublicPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/EditPublic/,
  editTargetedPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/EditTargeted/,
  editSavePathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/Edit(?:Public|Targeted)(?:\?|$)/,
  launchPromptPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/LaunchPrompt/,
  launchPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/\d+\/Launch(?:\?|$)/,
  addCampaignLink: (page: Page): Locator => page.getByRole('link', { name: 'Add Campaign' }),
  hideArchivedCheckbox: (page: Page): Locator => page.getByRole('checkbox', { name: 'Hide Archived Campaigns' }),
  campaignsGrid: (page: Page): Locator => page.locator('#grid-survey-campaigns'),
  campaignRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page.locator('#grid-survey-campaigns').getByRole('row', { name }).first(),
  campaignRowCell:
    (name: string | RegExp, cellText: string | RegExp): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid-survey-campaigns')
        .getByRole('row', { name })
        .first()
        .getByRole('gridcell', { name: cellText, exact: true }),
  testButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid-survey-campaigns')
        .getByRole('row', { name })
        .first()
        .getByRole('link', { name: 'Test', exact: true }),
  launchButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid-survey-campaigns')
        .getByRole('row', { name })
        .first()
        .getByRole('link', { name: 'Launch', exact: true }),
  viewResponseReportLinkInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid-survey-campaigns')
        .getByRole('row', { name })
        .first()
        .getByRole('link', { name: 'View Response Report', exact: true }),
  editButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page.locator('#grid-survey-campaigns').getByRole('row', { name }).first().getByTitle('Edit Campaign'),
  copyButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page.locator('#grid-survey-campaigns').getByRole('row', { name }).first().getByTitle('Copy Campaign'),
  deleteButtonInRow:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      page.locator('#grid-survey-campaigns').getByRole('row', { name }).first().getByTitle('Delete Campaign'),
};

export const AddCampaignDialogTargets = {
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Add Campaign' }),
  createNewRadio: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('radio', { name: 'Create a new campaign' }),
  copyFromRadio: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('radio', { name: 'Copy from' }),
  copyFromDropdown: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).locator('.copy-from-dropdown'),
  copyFromOption:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name, exact: true }),
  continueButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('button', { name: 'Continue' }),
  nameInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('textbox', { name: 'Name' }),
  typeDropdown: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('listbox', { name: 'Type' }),
  typeOption:
    (type: SurveyCampaignType): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name: type, exact: true }),
  endDateInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('combobox', { name: 'End Date' }),
  allowPageSkippingCheckbox: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('checkbox', { name: /Allow Page Skipping/i }),
  saveProgressButtonTextInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('textbox', { name: '"Save Progress" Button Text' }),
  nextButtonTextInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('textbox', { name: '"Next" Button Text' }),
  completeAndSubmitButtonTextInput: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'Add Campaign' })
      .getByRole('textbox', { name: '"Complete & Submit" Button Text' }),
  previousButtonTextInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('textbox', { name: '"Previous" Button Text' }),
  saveButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Add Campaign' }).getByRole('button', { name: 'Cancel' }),
};

export const CopyCampaignDialogTargets = {
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Copy Campaign' }),
  nameInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Copy Campaign' }).getByRole('textbox', { name: 'Name' }),
  typeDropdown: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Copy Campaign' }).getByRole('listbox', { name: 'Type' }),
  saveButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Copy Campaign' }).getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Copy Campaign' }).getByRole('button', { name: 'Cancel' }),
};

export const DeleteCampaignDialogTargets = {
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Delete Campaign' }),
  deleteButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Delete Campaign' }).getByRole('button', { name: 'Delete' }),
  cancelButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Delete Campaign' }).getByRole('button', { name: 'Cancel' }),
};

export const editCampaignFrameOwner: FrameOwner = (page: Page) =>
  page.locator('.ui-dialog.using-iframe:visible').last().frameLocator('iframe');

export const EditCampaignDialogTargets = {
  editDialogPathRegex: /\/Admin\/App\/\d+\/SurveyCampaign\/(\d+)\/Edit/,
  dialog: (page: Page): Locator => page.locator('.ui-dialog.using-iframe:visible').last(),
  iframe: (page: Page): Locator =>
    page
      .locator('.ui-dialog.using-iframe:visible')
      .last()
      .locator('iframe.dialog[src*="/SurveyCampaign/"][src*="/Edit"]'),
  saveButton: (page: Page): Locator =>
    page.locator('.ui-dialog.using-iframe:visible').last().getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator =>
    page.locator('.ui-dialog.using-iframe:visible').last().getByRole('button', { name: 'Cancel' }),
  nameInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).getByRole('textbox', { name: 'Name' }),
  endDateInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).getByRole('combobox', { name: 'End Date' }),
  archiveCheckbox: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#ArchiveSurveyCampaign'),
  allowPageSkippingCheckbox: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#AllowPageSkipping'),
  saveProgressButtonTextInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#SaveButtonText'),
  nextButtonTextInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#NextButtonText'),
  completeAndSubmitButtonTextInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#SubmitButtonText'),
  previousButtonTextInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#PreviousButtonText'),
  surveyUrlCell: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('tr:has(td:has-text("Survey URL")) td').nth(1),
  generalTab: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner)
      .locator('#dialog-tab-strip')
      .getByRole('tab', { name: 'General', exact: true }),
  surveyPoolTab: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner)
      .locator('#dialog-tab-strip')
      .getByRole('tab', { name: 'Survey Pool', exact: true }),
  notifierTab: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner)
      .locator('#dialog-tab-strip')
      .getByRole('tab', { name: 'Notifier', exact: true }),
  fromNameInput: (page: Page): Locator => resolveFrameOwner(page, editCampaignFrameOwner).locator('#FromName'),
  fromAddressLocalPartInput: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('#local-part'),
  subjectInput: (page: Page): Locator => resolveFrameOwner(page, editCampaignFrameOwner).locator('#Subject'),
  notifierBodyEditor: (page: Page): Locator =>
    resolveFrameOwner(page, editCampaignFrameOwner).locator('.rich-text-editor:has(#Body) .mce-content-body'),
};

export const LaunchCampaignDialogTargets = {
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Campaign Launch' }),
  content: (page: Page): Locator => page.getByRole('dialog', { name: 'Campaign Launch' }).locator('.ui-dialog-content'),
  launchButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Campaign Launch' }).getByRole('button', { name: 'Launch' }),
  closeButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Campaign Launch' }).getByRole('button', { name: 'Close' }),
};

export const PublicSurveyPageTargets = {
  testPathRegex: /\/Survey\/[^/]+\/[^/]+\/Test/i,
  publicPathRegex: /\/Survey\/[0-9a-f-]+/i,
  testModeBannerText: 'This is a test survey. The results will not be saved in the survey content.',
  testModeBanner: (page: Page): Locator => page.locator('.sub-header.test-mode'),
  questionText:
    (text: string | RegExp): Target =>
    (page: Page): Locator =>
      page.getByText(text),
};
