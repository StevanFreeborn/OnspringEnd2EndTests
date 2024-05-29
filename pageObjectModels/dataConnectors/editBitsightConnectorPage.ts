import { Page } from '@playwright/test';
import { EditConnectorPage } from './editConnectorPage';

export class EditBitsightConnectorPage extends EditConnectorPage {
  constructor(page: Page) {
    super(page);
  }
}
