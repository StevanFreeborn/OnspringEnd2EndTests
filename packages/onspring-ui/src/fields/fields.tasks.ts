import { Response } from '@playwright/test';
import {
  AttachmentField,
  DateField,
  FormulaField,
  ImageField,
  LayoutItem,
  LayoutItemPermission,
  LayoutItemType,
  ListField,
  ListFormulaField,
  ListValue,
  NumberField,
  ReferenceField,
  TextField,
  TimeSpanField,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppLayoutTabTargets } from '../apps/apps.targets.js';
import { TabbedColorPickerTasks } from '../common/controls/tabbedColorPicker.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { FieldTargets } from './fields.targets.js';

function isSupportedField(field: LayoutItem): boolean {
  return (
    field instanceof TextField ||
    field instanceof NumberField ||
    field instanceof DateField ||
    field instanceof ListField ||
    field instanceof ReferenceField ||
    field instanceof AttachmentField ||
    field instanceof ImageField ||
    field instanceof TimeSpanField ||
    field instanceof FormulaField
  );
}

async function addListValues(actor: WebActor, values: ListValue[], frameNumber: number): Promise<void> {
  const { listValuesGrid, frame } = FieldTargets.modal;

  for (const listValue of values) {
    await actor.browse().click(listValuesGrid.addValueButton(frameNumber));
    await actor.browse().fill(listValuesGrid.lastRowValueInput(frameNumber), listValue.value);
    await actor.browse().fill(listValuesGrid.lastRowNumericValueInput(frameNumber), listValue.numericValue.toString());

    if (listValue.color) {
      await actor.attemptsTo(
        TabbedColorPickerTasks.selectColor(
          listValuesGrid.lastRowColorPicker(frameNumber),
          listValue.color,
          frame(frameNumber)
        )
      );
    }
  }
}

async function fillFieldGeneralTab(actor: WebActor, field: LayoutItem, frameNumber: number): Promise<void> {
  if (!isSupportedField(field)) {
    throw new Error(`Unsupported layout item type "${field.type}" in FieldTasks.`);
  }

  const modal = FieldTargets.modal;
  await actor.browse().waitForState(modal.nameInput(frameNumber), 'visible');
  await actor.browse().fill(modal.nameInput(frameNumber), field.name);

  if (field instanceof ListField) {
    await addListValues(actor, field.values, frameNumber);
  } else if (field instanceof DateField) {
    await actor.browse().click(modal.dateDisplaySelect(frameNumber));
    await actor.browse().click(modal.dateDisplayOption(field.display, frameNumber));
  } else if (field instanceof ReferenceField) {
    const initialDisplayFieldResponse = actor
      .browse()
      .waitForResponse((r: Response) => modal.referenceDisplayFieldsPathRegex.test(r.url()) && r.status() === 200);
    await actor.browse().click(modal.referenceSelect(frameNumber));
    await initialDisplayFieldResponse;

    const referenceSelectText = await actor.browse().getText(modal.referenceSelect(frameNumber));
    if (referenceSelectText.includes(field.reference)) {
      await actor.browse().click(modal.referenceOption(field.reference, frameNumber));
    } else {
      const displayFieldResponse = actor
        .browse()
        .waitForResponse((r: Response) => modal.referenceDisplayFieldsPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(modal.referenceOption(field.reference, frameNumber));
      await displayFieldResponse;
    }

    await actor.browse().waitForState(modal.selectedGridFields(frameNumber), 'visible');
  } else if (field instanceof FormulaField) {
    await actor.browse().click(modal.formulaOutputTypeSelect(frameNumber));
    await actor.browse().click(modal.formulaOutputTypeOption(field.outputType, frameNumber));

    if (field instanceof ListFormulaField) {
      await addListValues(actor, field.values, frameNumber);
    }

    await actor.browse().setCodeMirrorValue(modal.formulaEditor(frameNumber), field.formula);
  }
}

async function setFieldSecurityPermissions(
  actor: WebActor,
  permissions: LayoutItemPermission[],
  frameNumber: number
): Promise<void> {
  const modal = FieldTargets.modal;
  await actor.browse().waitForState(modal.securityTabButton(frameNumber), 'visible');
  await actor.browse().click(modal.securityTabButton(frameNumber));

  if (permissions.length > 0) {
    await actor.browse().click(modal.securityViewSelect(frameNumber));
    await actor.browse().click(modal.securityOption('Role-Based', frameNumber));

    for (const permission of permissions) {
      const editCheckbox = modal.permissionsGrid.roleEditCheckbox(permission.roleName, frameNumber);
      if ((await actor.browse().isVisible(editCheckbox)) && (await actor.browse().isEditable(editCheckbox))) {
        await actor.browse().setChecked(editCheckbox, permission.update);
      }

      const readCheckbox = modal.permissionsGrid.roleReadCheckbox(permission.roleName, frameNumber);
      if ((await actor.browse().isVisible(readCheckbox)) && (await actor.browse().isEditable(readCheckbox))) {
        await actor.browse().setChecked(readCheckbox, permission.read);
      }
    }
  } else {
    await actor.browse().click(modal.securityViewSelect(frameNumber));
    await actor.browse().click(modal.securityOption('Public', frameNumber));
  }
}

async function saveFieldModal(actor: WebActor): Promise<void> {
  const saveFieldResponse = actor
    .browse()
    .waitForResponse((r: Response) => FieldTargets.addOrEditFieldPathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(FieldTargets.modal.saveButton);
  await saveFieldResponse;
}

async function ensureDesignerFieldsTabSelected(actor: WebActor): Promise<void> {
  const designer = AppLayoutTabTargets.designer;
  if (await actor.browse().isVisible(designer.addObjectButton)) {
    await actor.browse().click(designer.fieldsTabButton);
  }
  await actor.browse().waitForState(designer.addFieldButton, 'visible');
}

export const FieldTasks = {
  addFromGrid:
    (field: LayoutItem): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(FieldTargets.addFieldButton);
      await actor.browse().click(FieldTargets.addLayoutItemMenuOption(field.type));

      const addItemResponse = actor
        .browse()
        .waitForResponse((r: Response) => FieldTargets.addItemPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);
      await addItemResponse;

      await fillFieldGeneralTab(actor, field, 0);
      await setFieldSecurityPermissions(actor, field.permissions, 0);
      await saveFieldModal(actor);
    },

  addFromLayoutDesigner:
    (field: LayoutItem): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureDesignerFieldsTabSelected(actor);

      await actor.browse().click(designer.addFieldButton);
      await actor.browse().click(designer.addFieldMenuOption(field.type));

      const addItemResponse = actor
        .browse()
        .waitForResponse((r: Response) => FieldTargets.addItemPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);
      await addItemResponse;

      await fillFieldGeneralTab(actor, field, 1);
      await setFieldSecurityPermissions(actor, field.permissions, 1);
      await saveFieldModal(actor);
      await actor.browse().waitForState(designer.fieldFromBank(field.name), 'visible');
    },

  copyFromGridRow:
    (sourceFieldName: string, expectedCopyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(sourceFieldName));
      await actor.browse().click(FieldTargets.copyButtonInRow(sourceFieldName));

      const nameInput = FieldTargets.modal.nameInput(0);
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().check(nameInput).hasValue(expectedCopyName);
      await saveFieldModal(actor);
    },

  copyFromAddFieldButton:
    (itemType: LayoutItemType, sourceFieldName: string, expectedCopyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(FieldTargets.addFieldButton);
      await actor.browse().click(FieldTargets.addLayoutItemMenuOption(itemType));
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromRadioButton);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromDropdown);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromOption(sourceFieldName));
      await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);

      const nameInput = FieldTargets.modal.nameInput(0);
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().check(nameInput).hasValue(expectedCopyName);
      await saveFieldModal(actor);
    },

  copyFromLayoutDesigner:
    (itemType: LayoutItemType, sourceFieldName: string, expectedCopyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureDesignerFieldsTabSelected(actor);

      await actor.browse().click(designer.addFieldButton);
      await actor.browse().click(designer.addFieldMenuOption(itemType));
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromRadioButton);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromDropdown);
      await actor.browse().click(FieldTargets.addLayoutItemDialog.copyFromOption(sourceFieldName));
      await actor.browse().click(FieldTargets.addLayoutItemDialog.continueButton);

      const nameInput = FieldTargets.modal.nameInput(1);
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().check(nameInput).hasValue(expectedCopyName);
      await saveFieldModal(actor);
    },

  updateNameFromGrid:
    (currentFieldName: string, updatedFieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(currentFieldName));
      await actor.browse().click(FieldTargets.editButtonInRow(currentFieldName));

      const nameInput = FieldTargets.modal.nameInput(0);
      await actor.browse().waitForState(nameInput, 'visible');
      await actor.browse().fill(nameInput, updatedFieldName);
      await saveFieldModal(actor);
    },

  updatePermissionsFromGrid:
    (fieldName: string, permissions: LayoutItemPermission[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(fieldName));
      await actor.browse().click(FieldTargets.editButtonInRow(fieldName));

      await setFieldSecurityPermissions(actor, permissions, 0);
      await saveFieldModal(actor);
    },

  deleteFromGrid:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(FieldTargets.rowByName(fieldName));
      await actor.browse().click(FieldTargets.deleteButtonInRow(fieldName));

      const deleteResponse = actor
        .browse()
        .waitForResponse((r: Response) => FieldTargets.deleteLayoutItemPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteResponse;
    },
};
