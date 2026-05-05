import { Locator, Page } from '../../fixtures';
import { DashboardFilter, DashboardFilterFieldMapping, ReferenceDashboardFilter } from '../../models/dashboardFilter';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class AddOrEditDashboardFilterModal {
  private readonly modal: Locator;
  private readonly filterLabelInput: Locator;
  private readonly dataTypeSelector: Locator;
  private readonly referencedAppSelector: Locator;
  private readonly fieldMappingGrid: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /(Add|Edit) Dashboard Filter/ });
    this.filterLabelInput = this.modal.locator('.label:has-text("Filter Label") + .data').getByRole('textbox');
    this.dataTypeSelector = this.modal.locator('.label:has-text("Data Type") + .data').getByRole('listbox');
    this.referencedAppSelector = this.modal.locator('.label:has-text("Referenced App") + .data').getByRole('listbox');
    this.fieldMappingGrid = this.modal.locator('#FilterFieldMappingGrid');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  private async selectDataType(dataType: string) {
    await this.dataTypeSelector.click();
    await this.modal.page().getByRole('option', { name: dataType }).click();
  }

  private async selectReferencedApp(referencedApp: string) {
    await this.referencedAppSelector.click();
    await this.modal.page().getByRole('option', { name: referencedApp }).click();
  }

  private async mapFields(mappings: DashboardFilterFieldMapping[]) {
    for (const mapping of mappings) {
      const row = this.fieldMappingGrid.getByRole('row', { name: mapping.dashboardObject });
      const selector = new DualPaneSelector(row.locator('td').nth(1));
      await selector.selectOptions(mapping.fields);
    }
  }

  async fillOutForm(filter: DashboardFilter) {
    await this.filterLabelInput.fill(filter.filterLabel);
    await this.selectDataType(filter.type);

    if (filter instanceof ReferenceDashboardFilter) {
      await this.selectReferencedApp(filter.referencedApp);
    }

    await this.mapFields(filter.fieldMappings);
  }

  async save() {
    await this.saveButton.click();
  }
}
