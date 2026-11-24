import { Response } from '@playwright/test';
import { TEST_SURVEY_NAME } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { AutoSaveDialogTargets, SurveyDesignerTargets } from './surveyDesigner.targets.js';
import { CreateSurveyModalTargets, SurveyDetailTargets, SurveysPageTargets } from './surveys.targets.js';

async function completeCreateSurveyModal(actor: WebActor, surveyName: string): Promise<void> {
  await actor.browse().waitForState(CreateDialogTargets.continueButton, 'visible');
  await actor.browse().click(CreateDialogTargets.continueButton);

  await actor.browse().waitForState(CreateSurveyModalTargets.nameInput, 'visible');
  await actor.browse().fill(CreateSurveyModalTargets.nameInput, surveyName);

  const navPromise = actor.browse().waitForUrl(SurveyDetailTargets.pathRegex);
  await actor.browse().click(CreateSurveyModalTargets.saveButton);
  await navPromise;
}

async function performSurveyRowDeletion(
  actor: WebActor,
  rowName: string | RegExp,
  waitForNetworkRefresh: boolean
): Promise<void> {
  const row = SurveysPageTargets.surveyRow(rowName);
  await actor.browse().hover(row);
  await actor.browse().click(SurveysPageTargets.deleteSurveyButtonForRow(rowName));
  await actor.browse().type(SurveysPageTargets.deleteConfirmationInput, 'OK', { delay: 100 });

  if (waitForNetworkRefresh) {
    const deleteResponse = actor.browse().waitForResponse(SurveysPageTargets.deleteSurveyPathRegex);
    const refreshListResponse = actor.browse().waitForResponse(SurveysPageTargets.readSurveyListPathRegex);
    await actor.browse().click(DeleteDialogTargets.deleteButton);
    await deleteResponse;
    await refreshListResponse;
    return;
  }

  await actor.browse().click(DeleteDialogTargets.deleteButton);
  await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
  await actor.browse().waitForState(row, 'hidden');
}

export const SurveyTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getSurveysResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => SurveysPageTargets.readSurveyListPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().goto(SurveysPageTargets.route);
      await getSurveysResponse;
    },

  gotoSurvey:
    (surveyId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`${SurveyDetailTargets.pathPrefix}${surveyId}`);
    },

  openDesignTab:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SurveyDetailTargets.designTabButton);
      await actor.browse().waitForState(SurveyDetailTargets.designSurveyLink, 'visible');
    },

  gotoSurveyDesignTab:
    (surveyId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SurveyTasks.gotoSurvey(surveyId), SurveyTasks.openDesignTab());
    },

  openSurveyDesigner:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().addLocatorHandler(
        AutoSaveDialogTargets.dialog,
        async () => {
          await actor.browse().click(AutoSaveDialogTargets.dismissCheckbox);
          await actor.browse().click(AutoSaveDialogTargets.closeButton);
        },
        { times: 1 }
      );

      const designResponse = actor.browse().waitForResponse(SurveyDetailTargets.designPathRegex);
      await actor.browse().click(SurveyDetailTargets.designSurveyLink);
      await designResponse;
      await actor.browse().waitForState(SurveyDesignerTargets.modal, 'visible');
    },

  createViaTile:
    (surveyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(AdminNavTargets.homeRoute);
      await actor.browse().hover(AdminTileTargets.surveyTileLink);
      await actor.browse().waitForState(AdminTileTargets.surveyTileCreateButton, 'visible');
      await actor.browse().click(AdminTileTargets.surveyTileCreateButton);
      await completeCreateSurveyModal(actor, surveyName);
    },

  createViaHeader:
    (surveyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().waitForState(AdminNavTargets.adminCreateMenu, 'visible');
      await actor.browse().click(AdminNavTargets.menuOption('Survey'));
      await completeCreateSurveyModal(actor, surveyName);
    },

  createFromSurveysPage:
    (surveyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SurveyTasks.goto());
      await actor.browse().click(SurveysPageTargets.createSurveyButton);
      await completeCreateSurveyModal(actor, surveyName);
    },

  /**
   * Creates a survey from the Admin Home tile so fixture setup avoids loading `/Admin/Survey/SurveyListRead`.
   */
  create: (surveyName: string): Task<WebActor> => SurveyTasks.createViaTile(surveyName),

  deleteSurveys:
    (surveyNames: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SurveyTasks.goto());

      for (const surveyName of surveyNames) {
        const row = SurveysPageTargets.surveyRow(surveyName);

        if (!(await actor.browse().isVisible(row))) {
          continue;
        }

        await performSurveyRowDeletion(actor, surveyName, false);
      }
    },

  deleteAllTestSurveys:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SurveyTasks.goto());
      const testSurveyPattern = new RegExp(TEST_SURVEY_NAME, 'i');
      const testSurveyRow = SurveysPageTargets.surveyRow(testSurveyPattern);

      while (await actor.browse().isVisible(testSurveyRow)) {
        await performSurveyRowDeletion(actor, testSurveyPattern, true);
      }
    },
};
