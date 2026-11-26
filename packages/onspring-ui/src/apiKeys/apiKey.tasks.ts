import { Response } from '@playwright/test';
import { ApiKey, TEST_API_KEY_NAME } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { ApiKeyDetailTargets, ApiKeysPageTargets } from './apiKeys.targets.js';

export const ApiKeyTasks = {
  createViaHeader:
    (apiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('API Key'));
      await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
      const savePromise = actor.browse().waitForResponse(r => r.url().match(ApiKeyDetailTargets.pathRegex) !== null);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await savePromise;
    },

  createViaSecurityTile:
    (apiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.securityTileLink);
      await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.securityTileCreateButton);
      await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.securityMenuOption('API Key'));
      await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
    },

  createFromGrid:
    (apiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ApiKeysPageTargets.createApiKeyButton);
      await actor.browse().type(CreateDialogTargets.nameInput, apiKeyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
    },

  copyViaHeader:
    (sourceApiKeyName: string, copyApiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
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

  copyViaSecurityTile:
    (sourceApiKeyName: string, copyApiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
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

  copyFromGrid:
    (sourceApiKeyName: string, copyApiKeyName: string) =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ApiKeysPageTargets.createApiKeyButton);
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(sourceApiKeyName));
      await actor.browse().type(CreateDialogTargets.nameInput, copyApiKeyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
    },

  gotoGrid:
    () =>
    async (actor: WebActor): Promise<void> => {
      const responsePromise = actor.browse().waitForResponse(ApiKeysPageTargets.getListPagePath);
      await actor.browse().goto(ApiKeysPageTargets.route);
      await responsePromise;
    },

  deleteKeys:
    (names: string[]) =>
    async (actor: WebActor): Promise<void> => {
      if (names.length === 0) return;
      await ApiKeyTasks.gotoGrid()(actor);
      for (const name of names) {
        const apiKeyRow = ApiKeysPageTargets.rowByName(name);
        if (await actor.browse().isVisible(apiKeyRow)) {
          await actor.browse().hover(apiKeyRow);
          await actor.browse().click(ApiKeysPageTargets.deleteButtonInRow(name));
          const deleteResponse = actor
            .browse()
            .waitForResponse(
              (r: Response) => r.url().match(ApiKeysPageTargets.deleteApiKeyPathRegex) !== null && r.status() === 200
            );
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
        }
      }
    },

  assignRole:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ApiKeyDetailTargets.generalTabButton);
      await actor.browse().click(ApiKeyDetailTargets.generalTab.roleSelect);
      await actor.browse().click(ApiKeyDetailTargets.generalTab.roleOption(roleName));
    },

  update:
    (apiKey: ApiKey): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ApiKeyDetailTargets.generalTabButton);
      await actor.browse().fill(ApiKeyDetailTargets.generalTab.nameInput, apiKey.name);
      await actor.browse().fill(ApiKeyDetailTargets.generalTab.descriptionEditor, apiKey.description);
      await actor.browse().click(ApiKeyDetailTargets.generalTab.roleSelect);
      await actor.browse().click(ApiKeyDetailTargets.generalTab.roleOption(apiKey.role));
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: ApiKeyDetailTargets.generalTab.statusSwitch,
          toggleTarget: ApiKeyDetailTargets.generalTab.statusToggle,
          enabled: apiKey.status,
        })
      );
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(r => r.url().match(ApiKeyDetailTargets.pathRegex) !== null && r.request().method() === 'POST');
      await actor.browse().click(ApiKeyDetailTargets.saveButton);
      await saveResponse;
    },

  toggleStatus:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(ApiKeyDetailTargets.generalTab.statusToggle);
    },

  deleteAllTestApiKeys:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        ApiKeyTasks.gotoGrid(),
        KendoGridTasks.deleteAllMatchingRows({
          grid: ApiKeysPageTargets.grid,
          rowName: new RegExp(TEST_API_KEY_NAME, 'i'),
          deleteButtonTitle: 'Delete API Key',
          deleteResponseMatcher: (url: string) => ApiKeysPageTargets.deleteApiKeyPathRegex.test(url),
          pick: 'first',
        })
      );
    },
};
