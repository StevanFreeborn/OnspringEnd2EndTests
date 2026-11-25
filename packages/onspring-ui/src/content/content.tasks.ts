import { Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { ReferenceFieldGrid } from '../common/controls/referenceFieldGrid.js';
import { TimeSpanFieldControlTasks, TimeSpanUnit } from '../common/controls/timeSpanFieldControl.js';
import { ContentQuestions } from './content.questions.js';
import { ContentFieldLocation, ContentRecordTargets } from './content.targets.js';

export type GenerateDynamicDocumentOptions =
  | {
      fileType: 'PDF' | 'Microsoft Word';
      documentAction: 'Email the document to me' | 'Save to an attachment field and email it to me';
      emailDelivery: 'Email a link to the document' | 'Attach to the email';
    }
  | {
      fileType: 'PDF' | 'Microsoft Word';
      documentAction: 'Save to an attachment field';
    };

export const ContentTasks = {
  gotoAppContent:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.appContentRoute(appId));
    },

  gotoAdd:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.addRoute(appId));
    },

  gotoEdit:
    (appId: number, recordId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.editRoute(appId, recordId));
    },

  gotoView:
    (appId: number, recordId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.viewRoute(appId, recordId));
    },

  openActionMenu:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ContentRecordTargets.actionMenuButton);
      await actor.browse().waitForState(ContentRecordTargets.actionMenu, 'visible');
    },

  generateDynamicDocument:
    (options: GenerateDynamicDocumentOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(ContentTasks.openActionMenu());
      await actor.browse().click(ContentRecordTargets.actionMenuOption('Generate Document'));

      const modal = ContentRecordTargets.generateDocumentModal;
      await actor.browse().waitForState(modal.dialog, 'visible');

      await actor.browse().click(modal.fileTypeSelect);
      await actor.browse().click(modal.optionByName(options.fileType));

      await actor.browse().click(modal.documentActionSelect);
      await actor.browse().click(modal.optionByName(options.documentAction, true));

      if (options.documentAction !== 'Save to an attachment field') {
        await actor.browse().click(modal.emailDeliverySelect);
        await actor.browse().click(modal.optionByName(options.emailDelivery));
      }

      await actor.browse().click(modal.okButton);
      await actor.browse().click(modal.closeButton);
      await actor.browse().waitForState(modal.dialog, 'hidden');
    },

  fillText:
    (fieldName: string, value: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(ContentRecordTargets.textField(fieldName), value);
    },

  fillTextField:
    ({ tabName, sectionName, fieldName, value }: ContentFieldLocation & { value: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.browse().fill(ContentRecordTargets.textFieldInSection(sectionTarget, fieldName), value);
    },

  typeTextField:
    ({
      tabName,
      sectionName,
      fieldName,
      value,
      delay = 150,
    }: ContentFieldLocation & { value: string; delay?: number }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.browse().type(ContentRecordTargets.textFieldInSection(sectionTarget, fieldName), value, { delay });
    },

  fillNumberField:
    ({ tabName, sectionName, fieldName, value }: ContentFieldLocation & { value: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.browse().fill(ContentRecordTargets.numberFieldInSection(sectionTarget, fieldName), value);
    },

  selectListField:
    ({ tabName, sectionName, fieldName, value }: ContentFieldLocation & { value: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.browse().click(ContentRecordTargets.listFieldInSection(sectionTarget, fieldName));
      await actor.browse().click(ContentRecordTargets.dropdownOption(value));
    },

  enterDateField:
    ({ tabName, sectionName, fieldName, date }: ContentFieldLocation & { date: Date }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.attemptsTo(
        DateFieldControlTasks.enterDate(ContentRecordTargets.dateFieldInSection(sectionTarget, fieldName), date)
      );
    },

  selectDateFieldUsingCalendar:
    ({
      tabName,
      sectionName,
      fieldName,
      year,
      month,
      day,
    }: ContentFieldLocation & { year: number; month: number; day: number }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.attemptsTo(
        DateFieldControlTasks.selectDateUsingCalendar(
          ContentRecordTargets.dateFieldInSection(sectionTarget, fieldName),
          year,
          month,
          day
        )
      );
    },

  fillTimeSpanField:
    ({
      tabName,
      sectionName,
      fieldName,
      quantity,
      unit,
    }: ContentFieldLocation & { quantity: string; unit: TimeSpanUnit }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.attemptsTo(
        TimeSpanFieldControlTasks.fill(
          ContentRecordTargets.timeSpanFieldInSection(sectionTarget, fieldName),
          quantity,
          unit
        )
      );
    },

  attemptAttachmentUpload:
    ({ tabName, sectionName, fieldName, filePath }: ContentFieldLocation & { filePath: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor
        .browse()
        .uploadViaFileChooser(ContentRecordTargets.attachmentUploadButtonInSection(sectionTarget, fieldName), filePath);
    },

  selectReferenceField:
    ({
      tabName,
      sectionName,
      fieldName,
      searchTerm,
      controlType = 'radio',
    }: ContentFieldLocation & {
      searchTerm: string;
      controlType?: 'checkbox' | 'radio';
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      await actor.attemptsTo(
        ReferenceFieldGrid.selectRecord({
          gridTarget: ContentRecordTargets.referenceFieldInSection(sectionTarget, fieldName),
          searchTerm,
          controlType,
        })
      );
    },

  checkReadOnlyFieldText:
    ({
      tabName,
      sectionName,
      fieldName,
      expectedText,
      timeout,
    }: ContentFieldLocation & {
      expectedText: string | RegExp;
      timeout?: number;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      const fieldTarget = ContentRecordTargets.readOnlyTextFieldInSection(sectionTarget, fieldName);
      const checkOptions = timeout ? { timeout } : undefined;
      await actor.browse().check(fieldTarget).isVisible(checkOptions);
      await actor.browse().check(fieldTarget).hasText(expectedText, checkOptions);
    },

  saveRecord:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(ContentRecordTargets.editPathRegex);
      await actor.browse().click(ContentRecordTargets.saveRecordButton);
      await navPromise;
      await actor.browse().waitForLoadState();
    },

  saveEditedRecord:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => ContentRecordTargets.editPathRegex.test(r.url()) && r.request().method() === 'POST'
        );
      await actor.browse().click(ContentRecordTargets.saveRecordButton);
      await saveResponse;
    },
};
