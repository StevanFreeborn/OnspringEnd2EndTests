import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { ReferenceFieldGrid } from '../common/controls/referenceFieldGrid.js';
import { TimeSpanFieldControlTasks, TimeSpanUnit } from '../common/controls/timeSpanFieldControl.js';
import { ContentQuestions } from './content.questions.js';
import { ContentFieldLocation, ContentRecordTargets } from './content.targets.js';

export const ContentTasks = {
  gotoAdd:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.addRoute(appId));
    },

  gotoView:
    (appId: number, recordId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.viewRoute(appId, recordId));
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
};
