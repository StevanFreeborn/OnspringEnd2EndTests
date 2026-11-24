import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FieldTargets } from './fields.targets.js';

export const FieldQuestions = {
  fieldIdInGrid:
    (fieldName: string): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const headers = await actor.browse().getAllTexts(FieldTargets.headerCells);
      const columnHeaderIndex = headers.findIndex(header => header.trim() === 'Field ID');

      if (columnHeaderIndex === -1) {
        throw new Error('The Field ID column header was not found.');
      }

      const fieldId = await actor.browse().textContent(FieldTargets.rowCellAt(fieldName, columnHeaderIndex));

      if (fieldId === null) {
        throw new Error(`The field ID for the field "${fieldName}" was not found.`);
      }

      return parseInt(fieldId.trim(), 10);
    },
};
