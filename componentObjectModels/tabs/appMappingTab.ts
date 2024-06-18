import { Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';
import { MappingGrid } from '../controls/mappingGrid';

export abstract class AppMappingTab {
  protected readonly mappingGrid: MappingGrid;

  constructor(page: Page) {
    const mappingGridContainer = page.locator('.section', {
      has: page.getByRole('heading', { name: /app mapping/i }),
    });

    this.mappingGrid = new MappingGrid(mappingGridContainer);
  }

  abstract fillOutForm(dataConnector: DataConnector): Promise<void>;
}
