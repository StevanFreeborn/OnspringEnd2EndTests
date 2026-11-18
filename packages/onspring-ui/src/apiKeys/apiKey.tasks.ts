import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { ApiKeyDetailTargets, ApiKeysPageTargets } from './apiKeys.targets.js';

export const ApiKeyTasks = {
  createViaHeader: (apiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('API Key'));
    await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
    const savePromise = actor.browse().waitForResponse(
      r => r.url().match(ApiKeyDetailTargets.pathRegex) !== null
    );
    await actor.browse().click(CreateDialogTargets.saveButton);
    await savePromise;
  },

  createViaSecurityTile: (apiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminTileTargets.securityTileLink);
    await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.securityTileCreateButton);
    await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
    await actor.browse().click(AdminTileTargets.securityMenuOption('API Key'));
    await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
    await actor.browse().click(CreateDialogTargets.saveButton);
  },

  createFromGrid: (apiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(ApiKeysPageTargets.createApiKeyButton);
    await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
    await actor.browse().click(CreateDialogTargets.saveButton);
  },

  copyViaHeader: (sourceApiKeyName: string, copyApiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().waitForLoadState();
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('API Key'));

    await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateDialogTargets.optionToCopy(sourceApiKeyName));
    await actor.browse().type(CreateDialogTargets.nameInput, copyApiKeyName);
    await actor.browse().click(CreateDialogTargets.saveButton);
  },

  copyViaSecurityTile: (sourceApiKeyName: string, copyApiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().waitForLoadState();
    await actor.browse().hover(AdminTileTargets.securityTileLink);
    await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.securityTileCreateButton);
    await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
    await actor.browse().click(AdminTileTargets.securityMenuOption('API Key'));

    await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateDialogTargets.optionToCopy(sourceApiKeyName));
    await actor.browse().type(CreateDialogTargets.nameInput, copyApiKeyName);
    await actor.browse().click(CreateDialogTargets.saveButton);
  },

  copyFromGrid: (sourceApiKeyName: string, copyApiKeyName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(ApiKeysPageTargets.createApiKeyButton);
    await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateDialogTargets.optionToCopy(sourceApiKeyName));
    await actor.browse().type(CreateDialogTargets.nameInput, copyApiKeyName);
    await actor.browse().click(CreateDialogTargets.saveButton);
  },

  gotoGrid: () => async (actor: WebActor): Promise<void> => {
    const responsePromise = actor.browse().waitForResponse(ApiKeysPageTargets.getListPagePath);
    await actor.browse().goto(ApiKeysPageTargets.route);
    await responsePromise;
  },

  deleteKeys: (names: string[]) => async (actor: WebActor): Promise<void> => {
    if (names.length === 0) return;
    await ApiKeyTasks.gotoGrid()(actor);
    for (const name of names) {
      const apiKeyRow = ApiKeysPageTargets.rowByName(name);
      if (await actor.browse().isVisible(apiKeyRow)) {
        await actor.browse().hover(apiKeyRow);
        await actor.browse().click(ApiKeysPageTargets.deleteButtonInRow(name));
        await actor.browse().click(DeleteDialogTargets.deleteButton);
        await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      }
    }
  },

  assignRole: (roleName: string) => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(ApiKeyDetailTargets.generalTabButton);
    await actor.browse().click(ApiKeyDetailTargets.generalTab.roleSelect);
    await actor.browse().click(ApiKeyDetailTargets.generalTab.roleOption(roleName));
  },

  save: () => async (actor: WebActor): Promise<void> => {
    const saveResponse = actor.browse().waitForResponse(
      r => r.url().match(ApiKeyDetailTargets.pathRegex) !== null && r.request().method() === 'POST'
    );
    await actor.browse().click(ApiKeyDetailTargets.saveButton);
    await saveResponse;
  },

  toggleStatus: () => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(ApiKeyDetailTargets.generalTab.statusToggle);
  },
};
