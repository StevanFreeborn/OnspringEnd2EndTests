import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { SurveyDesignerTargets } from './surveyDesigner.targets.js';
import { SurveyDesignerTasks } from './surveyDesigner.tasks.js';

export const SurveyDesignerQuestions = {
  nthSurveyItemId:
    (index: number): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      const target = SurveyDesignerTargets.nthSurveyItem(index);
      await actor.browse().waitForState(target, 'visible');
      const itemId = await actor.browse().getAttribute(target, 'data-item-id');

      if (itemId === null) {
        throw new Error(`Could not find item id for survey item at index ${index}.`);
      }

      return itemId;
    },

  surveyItemIdByText:
    (text: string): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      const target = SurveyDesignerTargets.surveyItemByText(text);
      await actor.browse().waitForState(target, 'visible');
      const itemId = await actor.browse().getAttribute(target, 'data-item-id');

      if (itemId === null) {
        throw new Error(`Could not find item id for survey item with text "${text}".`);
      }

      return itemId;
    },

  copyQuestion:
    (surveyItemId: string, questionText: string): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      await actor.browse().hover(SurveyDesignerTargets.surveyItemByIdAndText(surveyItemId, questionText));
      await actor.browse().click(SurveyDesignerTargets.surveyItemDuplicateButton(surveyItemId, questionText));

      const copiedItem = SurveyDesignerTargets.editingSurveyItemByText(questionText);
      await actor.browse().waitForState(copiedItem, 'visible');

      const itemId = await actor.browse().getAttribute(copiedItem, 'data-item-id');

      if (itemId === null) {
        throw new Error('Item id was not found on the copied survey question.');
      }

      await actor.attemptsTo(SurveyDesignerTasks.saveInlineEdit());
      return itemId;
    },

  previewSurvey:
    (): Question<WebActor, WebActor> =>
    async (actor: WebActor): Promise<WebActor> =>
      actor.browse().clickAndOpenNewTab(SurveyDesignerTargets.previewButton, 'SurveyPreview'),
};
