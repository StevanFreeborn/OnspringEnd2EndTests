import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { ReferenceFieldGrid } from '../common/controls/referenceFieldGrid.js';
import { ContentRecordTargets } from './content.targets.js';

async function resolveSectionTarget(
  actor: WebActor,
  tabName: string | undefined,
  sectionName: string
): Promise<Target> {
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
  if (!isSelected) {
    await actor.browse().click(tabButton);
  }

  const tabId = await actor.browse().getAttribute(tabButton, 'data-tab-id');
  if (tabId === null) {
    throw new Error(`Content tab "${tabName}" did not expose a data-tab-id attribute.`);
  }

  return ContentRecordTargets.sectionInHorizontalTab(tabId, sectionName);
}

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
    ({
      tabName,
      sectionName,
      fieldName,
      value,
    }: {
      tabName?: string;
      sectionName: string;
      fieldName: string;
      value: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await resolveSectionTarget(actor, tabName, sectionName);
      await actor.browse().fill(ContentRecordTargets.textFieldInSection(sectionTarget, fieldName), value);
    },

  selectListField:
    ({
      tabName,
      sectionName,
      fieldName,
      value,
    }: {
      tabName?: string;
      sectionName: string;
      fieldName: string;
      value: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await resolveSectionTarget(actor, tabName, sectionName);
      await actor.browse().click(ContentRecordTargets.listFieldInSection(sectionTarget, fieldName));
      await actor.browse().click(ContentRecordTargets.dropdownOption(value));
    },

  enterDateField:
    ({
      tabName,
      sectionName,
      fieldName,
      date,
    }: {
      tabName?: string;
      sectionName: string;
      fieldName: string;
      date: Date;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await resolveSectionTarget(actor, tabName, sectionName);
      await actor.attemptsTo(
        DateFieldControlTasks.enterDate(ContentRecordTargets.dateFieldInSection(sectionTarget, fieldName), date)
      );
    },

  selectReferenceField:
    ({
      tabName,
      sectionName,
      fieldName,
      searchTerm,
      controlType = 'radio',
    }: {
      tabName?: string;
      sectionName: string;
      fieldName: string;
      searchTerm: string;
      controlType?: 'checkbox' | 'radio';
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await resolveSectionTarget(actor, tabName, sectionName);
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
    }: {
      tabName?: string;
      sectionName: string;
      fieldName: string;
      expectedText: string | RegExp;
      timeout?: number;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sectionTarget = await resolveSectionTarget(actor, tabName, sectionName);
      await actor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(sectionTarget, fieldName))
        .hasText(expectedText, timeout ? { timeout } : undefined);
    },

  saveRecord:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(ContentRecordTargets.editPathRegex);
      await actor.browse().click(ContentRecordTargets.saveRecordButton);
      await navPromise;
    },
};
