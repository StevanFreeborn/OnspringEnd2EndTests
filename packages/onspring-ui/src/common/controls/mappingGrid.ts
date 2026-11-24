import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const mappingGridTargets = {
  sourceField:
    (containerTarget: Target, sourceName: string): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget)
        .locator('.drag-items-container')
        .locator(`.draggable:has-text("${sourceName}")`),
  targetRow:
    (containerTarget: Target, targetName: string): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget)
        .locator('.mappable-items')
        .locator('tr', {
          has: page.locator(`.field-cell:has-text("${targetName}")`),
        }),
  targetMappedItem:
    (containerTarget: Target, targetName: string): Target =>
    (page: Page) =>
      resolveTarget(page, mappingGridTargets.targetRow(containerTarget, targetName)).locator('.map-item-container'),
  targetDropZone:
    (containerTarget: Target, targetName: string): Target =>
    (page: Page) =>
      resolveTarget(page, mappingGridTargets.targetRow(containerTarget, targetName)).locator('.drag-and-drop-cell'),
};

export const MappingGridTasks = {
  performMapping:
    (containerTarget: Target, mappings: Record<string, string>[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const mapping of mappings) {
        for (const [key, value] of Object.entries(mapping)) {
          if (!value) {
            continue;
          }

          const mappedItemText = await actor
            .browse()
            .textContent(mappingGridTargets.targetMappedItem(containerTarget, value));

          if (mappedItemText === key) {
            continue;
          }

          const sourceField = mappingGridTargets.sourceField(containerTarget, key);
          const dropZone = mappingGridTargets.targetDropZone(containerTarget, value);

          await actor.browse().scrollIntoView(dropZone);
          await actor.browse().dragTo(sourceField, dropZone);
        }
      }
    },
};
