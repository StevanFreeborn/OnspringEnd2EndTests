import {
  AppSearch,
  CreateContentLinks,
  DashboardFormattedTextBlock,
  DashboardObjectItem,
  TEST_DASHBOARD_OBJECT_NAME,
  WebPage,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { DashboardObjectTargets } from './dashboardObjects.targets.js';
import { DashboardDesignerTargets } from './dashboards.targets.js';
import { DashboardTasks } from './dashboards.tasks.js';

async function fillAndSaveObjectModal(actor: WebActor, dashboardObject: DashboardObjectItem): Promise<void> {
  const modal = DashboardObjectTargets.modal;
  await actor.browse().waitForState(modal.dialog, 'visible');
  await actor.browse().click(modal.generalTabButton);
  await actor.browse().fill(modal.nameInput, dashboardObject.name);
  await actor.browse().setChecked(modal.hideHeaderCheckbox, dashboardObject.hideHeader);
  await actor.browse().setChecked(modal.hideContainerCheckbox, dashboardObject.hideContainer);

  switch (dashboardObject.type) {
    case 'App Search': {
      const appSearch = dashboardObject as AppSearch;
      await actor.attemptsTo(DualPaneSelector.selectOptions(modal.appsSelector, appSearch.apps));
      break;
    }
    case 'Create Content Links': {
      const contentLinks = dashboardObject as CreateContentLinks;
      const existingRowCount = await actor.browse().count(modal.linkRows);

      for (let i = existingRowCount - 1; i >= 0; i--) {
        const row = modal.linkRowAt(i);
        await actor.browse().hover(row);
        await actor.browse().click(modal.linkRowDeleteButtonAt(i));
        await actor.browse().waitForState(row, 'hidden');
      }

      for (const link of contentLinks.links) {
        await actor.browse().click(modal.addLinkButton);
        await actor.browse().click(modal.lastLinkRowAppSelector);
        await actor.browse().click(modal.pageOptionByName(link.app));

        if (link.imageSource.src === 'Library') {
          throw new Error('Not implemented');
        }

        await actor.browse().click(modal.lastLinkRowImageSourceSelector);
        await actor.browse().click(modal.pageOptionByName(link.imageSource.src));
        await actor.browse().fill(modal.lastLinkRowLinkTextInput, link.linkText);
      }
      break;
    }
    case 'Formatted Text Block': {
      const formattedTextBlock = dashboardObject as DashboardFormattedTextBlock;
      await actor.browse().fill(modal.formattedTextEditor, formattedTextBlock.formattedText);
      break;
    }
    case 'Web Page': {
      const webPage = dashboardObject as WebPage;
      await actor.browse().fill(modal.urlInput, webPage.url);
      await actor.browse().setChecked(modal.forceRefreshCheckbox, webPage.forceRefresh);
      break;
    }
    default:
      throw new Error(`Unknown dashboard object type: ${String(dashboardObject.type)}`);
  }

  await actor.browse().click(modal.securityTabButton);
  await actor.browse().click(modal.viewSelector);
  await actor.browse().click(modal.pageOptionByName(dashboardObject.view));

  if (dashboardObject.view === 'Private by Role') {
    await actor.attemptsTo(DualPaneSelector.selectOptions(modal.rolesSelector, dashboardObject.roles));
  }

  await actor.browse().click(modal.saveButton);
  await actor.browse().waitForState(modal.dialog, 'hidden');
}

export const DashboardObjectTasks = {
  addObject:
    (dashboardObject: DashboardObjectItem): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DashboardTasks.selectResourceTab('Objects'));
      await actor.browse().click(DashboardObjectTargets.addObjectButton);
      await actor.browse().waitForState(DashboardObjectTargets.addObjectMenu, 'visible');
      await actor.browse().click(DashboardObjectTargets.addObjectMenuOption(dashboardObject.type));
      await actor.browse().waitForState(CreateDialogTargets.continueButton, 'visible');
      await actor.browse().click(CreateDialogTargets.continueButton);
      await fillAndSaveObjectModal(actor, dashboardObject);
    },

  updateObject:
    (existingObjectName: string, updatedObject: DashboardObjectItem): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const itemTarget = DashboardDesignerTargets.resources.itemInBank('object', existingObjectName);
      await actor.attemptsTo(
        DashboardTasks.selectResourceTab('Objects'),
        DashboardTasks.locateItemInResourceBank(
          'object',
          existingObjectName,
          itemTarget,
          DashboardDesignerTargets.resources.getMoreObjectsPathRegex
        )
      );
      await actor.browse().hover(itemTarget);
      await actor.browse().click(DashboardObjectTargets.editObjectButtonInBank(existingObjectName));
      await fillAndSaveObjectModal(actor, updatedObject);
    },

  deleteObject:
    (objectName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const itemTarget = DashboardDesignerTargets.resources.itemInBank('object', objectName);
      await actor.attemptsTo(
        DashboardTasks.selectResourceTab('Objects'),
        DashboardTasks.locateItemInResourceBank(
          'object',
          objectName,
          itemTarget,
          DashboardDesignerTargets.resources.getMoreObjectsPathRegex
        )
      );

      if (!(await actor.browse().isVisible(itemTarget))) {
        return;
      }

      await actor.browse().hover(itemTarget);
      await actor.browse().click(DashboardObjectTargets.deleteObjectButtonInBank(objectName));
      await actor.browse().waitForState(DeleteDialogTargets.dialog, 'visible');
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForState(DeleteDialogTargets.dialog, 'hidden');
      await actor.browse().waitForState(itemTarget, 'hidden');
    },

  deleteAllTestDashboardObjects: (): Task<WebActor> => {
    const pattern = new RegExp(TEST_DASHBOARD_OBJECT_NAME, 'i');
    return DashboardTasks.deleteAllTestBankItems({
      tabName: 'Objects',
      bankName: 'object',
      itemNamePattern: pattern,
      loadMorePathRegex: DashboardDesignerTargets.resources.getMoreObjectsPathRegex,
      deletePathRegex: DashboardObjectTargets.deletePathRegex,
      deleteButtonInBank: DashboardObjectTargets.deleteLastObjectButtonInBank(pattern),
    });
  },
};
