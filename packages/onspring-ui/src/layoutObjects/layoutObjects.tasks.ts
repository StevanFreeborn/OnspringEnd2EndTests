import { Response } from '@playwright/test';
import { FormattedTextBlock, LayoutItemPermission, SectionLabel } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppLayoutTabTargets } from '../apps/apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { FieldTargets } from '../fields/fields.targets.js';
import { FieldTasks } from '../fields/fields.tasks.js';
import { LayoutObjectTargets } from './layoutObjects.targets.js';

export type LayoutObjectModel = FormattedTextBlock | SectionLabel;
export type LayoutObjectType = 'Formatted Text Block' | 'Section Label';

async function fillLayoutObjectGeneralTab(actor: WebActor, item: LayoutObjectModel): Promise<void> {
  const modal = LayoutObjectTargets.modal;
  await actor.browse().waitForState(modal.nameInput, 'visible');
  await actor.browse().fill(modal.nameInput, item.name);

  const content = item instanceof FormattedTextBlock ? item.formattedText : item.text;
  await actor.browse().fill(modal.contentEditor, content);
}

async function setLayoutObjectSecurityPermissions(actor: WebActor, permissions: LayoutItemPermission[]): Promise<void> {
  const modal = LayoutObjectTargets.modal;
  await actor.browse().waitForState(modal.securityTabButton, 'visible');
  await actor.browse().click(modal.securityTabButton);

  if (permissions.length > 0) {
    await actor.browse().click(modal.securityViewSelect);
    await actor.browse().click(modal.securityOption('Role-Based'));

    const readRoles = permissions.filter(permission => permission.read).map(permission => permission.roleName);
    if (readRoles.length > 0) {
      await actor.attemptsTo(DualPaneSelector.selectOptions(modal.roleSelector, readRoles));
    }
    return;
  }

  await actor.browse().click(modal.securityViewSelect);
  await actor.browse().click(modal.securityOption('Public'));
}

async function saveLayoutObjectModal(actor: WebActor): Promise<void> {
  const saveResponse = actor
    .browse()
    .waitForResponse((r: Response) => LayoutObjectTargets.addOrEditPathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(LayoutObjectTargets.modal.saveButton);
  await saveResponse;
}

async function saveCopiedLayoutObjectModal(
  actor: WebActor,
  expectedCopyName: string,
  options?: { timeout?: number }
): Promise<void> {
  const nameInput = LayoutObjectTargets.modal.nameInput;
  await actor
    .browse()
    .waitForState(nameInput, 'visible', options?.timeout !== undefined ? { timeout: options.timeout } : undefined);
  await actor.browse().check(nameInput).hasValue(expectedCopyName);
  await saveLayoutObjectModal(actor);
}

async function ensureDesignerObjectsTabSelected(actor: WebActor): Promise<void> {
  const designer = AppLayoutTabTargets.designer;
  if (await actor.browse().isVisible(designer.addFieldButton)) {
    await actor.browse().click(designer.objectsTabButton);
  }
  await actor.browse().waitForState(designer.addObjectButton, 'visible');
}

async function openAndSaveNewLayoutObject(
  actor: WebActor,
  triggerButton: Target,
  menuOption: Target,
  item: LayoutObjectModel
): Promise<void> {
  await actor.browse().click(triggerButton);
  await actor.browse().click(menuOption);

  const addItemResponse = actor
    .browse()
    .waitForResponse((r: Response) => FieldTargets.addItemPathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);
  await addItemResponse;

  await fillLayoutObjectGeneralTab(actor, item);
  await setLayoutObjectSecurityPermissions(actor, item.permissions);
  await saveLayoutObjectModal(actor);
}

async function copyViaAddDialogAndSave(
  actor: WebActor,
  triggerButton: Target,
  menuOption: Target,
  sourceObjectName: string,
  expectedCopyName: string
): Promise<void> {
  await actor.browse().click(triggerButton);
  await actor.browse().click(menuOption);
  await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromRadioButton);
  await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromDropdown);
  await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromOption(sourceObjectName));
  await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);

  await saveCopiedLayoutObjectModal(actor, expectedCopyName);
}

export const LayoutObjectTasks = {
  addFromGrid:
    (item: LayoutObjectModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openAndSaveNewLayoutObject(
        actor,
        FieldTargets.addFieldButton,
        FieldTargets.addLayoutItemMenuOption(item.type),
        item
      );
    },

  addFromLayoutDesigner:
    (item: LayoutObjectModel): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureDesignerObjectsTabSelected(actor);
      await openAndSaveNewLayoutObject(actor, designer.addObjectButton, designer.addObjectMenuOption(item.type), item);
      await actor.browse().waitForState(designer.objectFromBank(item.name), 'visible');
    },

  copyFromGridRow:
    (sourceObjectName: string, expectedCopyName: string, options?: { timeout?: number }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(sourceObjectName));
      await actor.browse().click(FieldTargets.copyButtonInRow(sourceObjectName));

      await saveCopiedLayoutObjectModal(actor, expectedCopyName, options);
    },

  copyFromAddFieldButton:
    (itemType: LayoutObjectType, sourceObjectName: string, expectedCopyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await copyViaAddDialogAndSave(
        actor,
        FieldTargets.addFieldButton,
        FieldTargets.addLayoutItemMenuOption(itemType),
        sourceObjectName,
        expectedCopyName
      );
    },

  copyFromLayoutDesigner:
    (itemType: LayoutObjectType, sourceObjectName: string, expectedCopyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureDesignerObjectsTabSelected(actor);
      await copyViaAddDialogAndSave(
        actor,
        designer.addObjectButton,
        designer.addObjectMenuOption(itemType),
        sourceObjectName,
        expectedCopyName
      );
    },

  updateNameFromGrid:
    (currentObjectName: string, updatedObjectName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(currentObjectName));
      await actor.browse().click(FieldTargets.editButtonInRow(currentObjectName));

      const nameInput = LayoutObjectTargets.modal.nameInput;
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().fill(nameInput, updatedObjectName);
      await saveLayoutObjectModal(actor);
    },

  updatePermissionsFromGrid:
    (objectName: string, permissions: LayoutItemPermission[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(objectName));
      await actor.browse().click(FieldTargets.editButtonInRow(objectName));

      await setLayoutObjectSecurityPermissions(actor, permissions);
      await saveLayoutObjectModal(actor);
    },

  deleteFromGrid: (objectName: string): Task<WebActor> => FieldTasks.deleteFromGrid(objectName),
};
