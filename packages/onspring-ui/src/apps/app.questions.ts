import { Download } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppLayoutTabTargets, LayoutDropzoneLocation } from './apps.targets.js';

async function resolveClampedLayoutDropzone(
  actor: WebActor,
  sectionTarget: Target,
  desiredColumn: number,
  desiredRow: number
): Promise<Target> {
  await actor.browse().waitForState(sectionTarget, 'visible');

  const itemsTarget = AppLayoutTabTargets.designer.renderedItemsInSection(sectionTarget);
  const columnAttrs = await actor.browse().getAttributes(itemsTarget, 'data-column');
  const rowAttrs = await actor.browse().getAttributes(itemsTarget, 'data-row');

  let maxColumn = -1;
  for (const col of columnAttrs) {
    if (col === null) continue;
    const colNum = parseInt(col, 10);
    if (colNum > maxColumn) maxColumn = colNum;
  }

  if (maxColumn < 0) {
    throw new Error('Invalid column number');
  }

  const column = Math.min(desiredColumn, maxColumn);

  let maxRow = -1;
  for (let i = 0; i < columnAttrs.length; i++) {
    const col = columnAttrs[i];
    const row = rowAttrs[i];
    if (col !== null && parseInt(col, 10) === column && row !== null) {
      maxRow += 1;
    }
  }

  if (maxRow < 0) {
    throw new Error('Invalid row number');
  }

  const row = Math.min(desiredRow, maxRow);

  return AppLayoutTabTargets.designer.dropzoneInSectionAt(sectionTarget, column, row);
}

export const AppQuestions = {
  downloadedFieldsAndObjectsExportFromEmailHtml:
    (html: string): Question<WebActor, Download> =>
    async (actor: WebActor): Promise<Download> => {
      await actor.browse().setContent(html);
      return actor.browse().clickAndWaitForDownload(AppLayoutTabTargets.exportEmailDownloadLink);
    },

  layoutDropzone:
    ({ tabName, sectionName, column, row }: LayoutDropzoneLocation): Question<WebActor, Target> =>
    async (actor: WebActor): Promise<Target> => {
      const designer = AppLayoutTabTargets.designer;
      let sectionTarget: Target;

      if (tabName === undefined) {
        sectionTarget = designer.standaloneSectionByName(sectionName);
      } else if (!(await actor.browse().isVisible(designer.canvasTabStrip))) {
        sectionTarget = designer.canvasSectionByName(sectionName);
      } else {
        const tabButton = designer.canvasTabButton(tabName);
        const tabClasses = await actor.browse().getAttribute(tabButton, 'class');
        if (!tabClasses?.includes('k-state-active')) {
          await actor.browse().click(designer.canvasTabText(tabName));
        }

        const tabId = await actor.browse().getAttribute(tabButton, 'data-canvas-tab');
        if (tabId === null) {
          throw new Error(`Layout designer tab "${tabName}" did not expose a data-canvas-tab attribute.`);
        }
        sectionTarget = designer.canvasSectionInTab(tabId, sectionName);
      }

      return resolveClampedLayoutDropzone(actor, sectionTarget, column, row);
    },
};
