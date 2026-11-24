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

async function resolveDesignerTabId(actor: WebActor, tabName: string): Promise<string> {
  const designer = AppLayoutTabTargets.designer;
  const tabButton = designer.canvasTabButton(tabName);
  const tabClasses = await actor.browse().getAttribute(tabButton, 'class');
  if (!tabClasses?.includes('k-state-active')) {
    await actor.browse().click(designer.canvasTabText(tabName));
  }

  const tabId = await actor.browse().getAttribute(tabButton, 'data-canvas-tab');
  if (tabId === null) {
    throw new Error(`Layout designer tab "${tabName}" did not expose a data-canvas-tab attribute.`);
  }
  return tabId;
}

export const AppQuestions = {
  downloadedFieldsAndObjectsExportFromEmailHtml:
    (html: string): Question<WebActor, Download> =>
    async (actor: WebActor): Promise<Download> => {
      await actor.browse().setContent(html);
      return actor.browse().clickAndWaitForDownload(AppLayoutTabTargets.exportEmailDownloadLink);
    },

  layoutDesignerTabOrientation:
    (): Question<WebActor, 'horizontal' | 'vertical'> =>
    async (actor: WebActor): Promise<'horizontal' | 'vertical'> => {
      const orientation = await actor.browse().getText(AppLayoutTabTargets.designer.tabOrientationSelected);
      if (!orientation) {
        throw new Error('Layout designer tab orientation was not found.');
      }
      return orientation.toLowerCase() === 'horizontal' ? 'horizontal' : 'vertical';
    },

  layoutDesignerTabId:
    (tabName: string): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> =>
      resolveDesignerTabId(actor, tabName),

  layoutDesignerSection:
    ({ tabName, sectionName }: { tabName?: string; sectionName: string }): Question<WebActor, Target> =>
    async (actor: WebActor): Promise<Target> => {
      const designer = AppLayoutTabTargets.designer;

      if (tabName === undefined) {
        return designer.standaloneSectionByName(sectionName);
      }

      if (!(await actor.browse().isVisible(designer.canvasTabStrip))) {
        return designer.canvasSectionByName(sectionName);
      }

      const tabId = await resolveDesignerTabId(actor, tabName);
      return designer.canvasSectionInTab(tabId, sectionName);
    },

  layoutDropzone:
    ({ tabName, sectionName, column, row }: LayoutDropzoneLocation): Question<WebActor, Target> =>
    async (actor: WebActor): Promise<Target> => {
      const sectionTarget = await actor.asks(AppQuestions.layoutDesignerSection({ tabName, sectionName }));
      return resolveClampedLayoutDropzone(actor, sectionTarget, column, row);
    },
};
