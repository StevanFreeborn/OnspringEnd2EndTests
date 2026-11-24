import { Response } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ContentFieldLocation, ContentRecordTargets, ContentSectionLocation } from './content.targets.js';

export const ContentQuestions = {
  currentRecordId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Content\/\d+\/(\d+)\/Edit/);

      if (match === null) {
        throw new Error('The current page is not a content edit page.');
      }

      return parseInt(match[1], 10);
    },

  currentAddAppId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Content\/(\d+)\/Add/);

      if (match === null) {
        throw new Error('The current page is not an add content page.');
      }

      return parseInt(match[1], 10);
    },

  section:
    ({ tabName, sectionName }: ContentSectionLocation): Question<WebActor, Target> =>
    async (actor: WebActor): Promise<Target> => {
      if (tabName === undefined) {
        return ContentRecordTargets.standaloneSection(sectionName);
      }

      if (!(await actor.browse().isVisible(ContentRecordTargets.tabStrip))) {
        return ContentRecordTargets.sectionByName(sectionName);
      }

      const containerClasses = await actor.browse().getAttribute(ContentRecordTargets.contentContainer, 'class');
      if (containerClasses?.includes('vertical-tabs')) {
        return ContentRecordTargets.sectionInVerticalTab(tabName, sectionName);
      }

      const tabButton = ContentRecordTargets.horizontalTabButton(tabName);
      const isSelected = (await actor.browse().getAttribute(tabButton, 'aria-selected')) === 'true';
      if (!isSelected && (await actor.browse().isVisible(tabButton))) {
        await actor.browse().click(tabButton);
      }

      const tabId = await actor.browse().getAttribute(tabButton, 'data-tab-id');
      if (tabId === null) {
        throw new Error(`Content tab "${tabName}" did not expose a data-tab-id attribute.`);
      }

      return ContentRecordTargets.sectionInHorizontalTab(tabId, sectionName);
    },

  uploadAttachment:
    ({
      tabName,
      sectionName,
      fieldName,
      filePath,
    }: ContentFieldLocation & { filePath: string }): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      const response = await actor
        .browse()
        .uploadViaFileChooser(
          ContentRecordTargets.attachmentUploadButtonInSection(sectionTarget, fieldName),
          filePath,
          { waitForResponseUrl: ContentRecordTargets.saveAttachmentPathRegex }
        );

      if (!response) {
        throw new Error('Expected attachment upload response was not received.');
      }

      const body = (await response.json()) as { data: { id: number }[] };
      return body.data[0].id;
    },

  uploadImage:
    ({
      tabName,
      sectionName,
      fieldName,
      filePath,
    }: ContentFieldLocation & { filePath: string }): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      const response = await actor
        .browse()
        .uploadViaFileChooser(ContentRecordTargets.imageBrowseButtonInSection(sectionTarget, fieldName), filePath, {
          waitForResponseUrl: ContentRecordTargets.saveImagePathRegex,
        });

      if (!response) {
        throw new Error('Expected image upload response was not received.');
      }

      const body = (await response.json()) as { data: { fileId: number }[] };
      return body.data[0].fileId;
    },

  createNewReferencedRecord:
    ({ tabName, sectionName, fieldName }: ContentFieldLocation): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const sectionTarget = await actor.asks(ContentQuestions.section({ tabName, sectionName }));
      const popupResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => ContentRecordTargets.createRecordModal.popupAddPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(ContentRecordTargets.referenceCreateNewButtonInSection(sectionTarget, fieldName));
      await popupResponse;

      const createRecordResponsePromise = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            ContentRecordTargets.createRecordModal.popupAddPathRegex.test(r.url()) &&
            r.request().method() === 'POST' &&
            r.status() === 200
        );
      const getRefRecordsResponsePromise = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            ContentRecordTargets.createRecordModal.getReferenceRecordsPathRegex.test(r.url()) && r.status() === 200
        );

      await actor.browse().click(ContentRecordTargets.createRecordModal.saveButton);
      const [createRecordResponse] = await Promise.all([createRecordResponsePromise, getRefRecordsResponsePromise]);

      const body = (await createRecordResponse.json()) as { data: { recordId: number } };
      return body.data.recordId;
    },
};
