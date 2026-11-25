import { FakeDataFactory, Survey } from '@stevanfreeborn/onspring-models';
import { SurveyQuestions, SurveyTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class SurveyFixtureBuilder {
  private name?: string;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build() {
    return async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (r: Survey) => Promise<void>) => {
      const surveyName = this.name ?? FakeDataFactory.createFakeSurveyName();
      await sysAdminActor.attemptsTo(SurveyTasks.create(surveyName));
      const surveyId = await sysAdminActor.asks(SurveyQuestions.idFromUrl());
      const survey = new Survey({ id: surveyId, name: surveyName });

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
