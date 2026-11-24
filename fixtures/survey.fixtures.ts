import { Page } from '@playwright/test';
import {
  FakeDataFactory as ScreenplayFakeDataFactory,
  Survey as ScreenplaySurvey,
} from '@stevanfreeborn/onspring-models';
import { SurveyQuestions, SurveyTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { Survey } from '../models/survey';
import { AdminHomePage } from '../pageObjectModels/adminHomePage';
import { SurveyAdminPage } from '../pageObjectModels/surveys/surveyAdminPage';

export class SurveyFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (r: ScreenplaySurvey) => Promise<void>) => {
      const surveyName = this.name ?? ScreenplayFakeDataFactory.createFakeSurveyName();
      const survey = await createSurveyWithActor(sysAdminActor, surveyName);

      await use(survey);

      // TODO: Not handling cleanup here because when
      // deleting surveys an exception sometimes
      // occurs when another user simultaneously
      // loads the surveys admin page.
      // reference: https://corp.onspring.com/Content/8/4162
      // await sysAdminActor.attemptsTo(SurveyTasks.deleteSurveys([survey.name]));
    };
  }
}

export class SurveyFixture {
  static create(): SurveyFixtureBuilder {
    return new SurveyFixtureBuilder();
  }
}

export async function createSurveyWithActor(
  actor: WebActor,
  surveyName: string = ScreenplayFakeDataFactory.createFakeSurveyName()
): Promise<ScreenplaySurvey> {
  await actor.attemptsTo(SurveyTasks.create(surveyName));
  const surveyId = await actor.asks(SurveyQuestions.idFromUrl());
  return new ScreenplaySurvey({ id: surveyId, name: surveyName });
}

export async function survey({ sysAdminPage }: { sysAdminPage: Page }, use: (r: Survey) => Promise<void>) {
  const adminHomePage = new AdminHomePage(sysAdminPage);
  const surveyAdminPage = new SurveyAdminPage(sysAdminPage);
  const surveyName = FakeDataFactory.createFakeSurveyName();

  await adminHomePage.goto();
  await adminHomePage.createSurvey(surveyName);
  await adminHomePage.page.waitForURL(surveyAdminPage.pathRegex);
  const surveyId = surveyAdminPage.getIdFromUrl();
  const survey = new Survey({ id: surveyId, name: surveyName });

  await use(survey);

  // TODO: Not handling cleanup here because when
  // deleting surveys an exception sometimes
  // occurs when another user simultaneously
  // loads the surveys admin page.
  // reference: https://corp.onspring.com/Content/8/4162
  // await surveysAdminPage.deleteSurveys([surveyName]);
}
