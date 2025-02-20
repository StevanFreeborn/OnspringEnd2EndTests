import { Locator } from '@playwright/test';
import { RestApiOutcome } from '../../models/restApiOutcome';
import { TreeviewSelector } from '../controls/treeviewSelector';

export class RestApiRequestTab {
  private readonly addDataMappingFieldButton: Locator;
  private readonly fieldMappingGridBody: Locator;

  constructor(modal: Locator) {
    this.addDataMappingFieldButton = modal.getByRole('button', { name: 'Add Field' });
    this.fieldMappingGridBody = modal.locator('#FieldMappingGrid').locator('.k-grid-content');
  }

  private async addFieldMapping(sourceField: string, onspringField: string) {
    const row = this.fieldMappingGridBody.getByRole('row').last();

    await this.addDataMappingFieldButton.click();
    await row.waitFor();

    const sourceFieldCell = row.locator('td').first();
    const onspringFieldCell = row.locator('td').nth(1);

    const sourceFieldInput = sourceFieldCell.locator('input:visible');
    const selector = onspringFieldCell.locator('.data .onx-selector');
    const onspringFieldSelector = new TreeviewSelector(selector);

    await sourceFieldInput.focus();
    await sourceFieldInput.pressSequentially(sourceField);
    await onspringFieldSelector.selectOption(onspringField);
  }

  async fillOutForm(outcome: RestApiOutcome) {
    for (const [key, value] of Object.entries(outcome.dataMappings)) {
      await this.addFieldMapping(key, value);
    }
  }
}
