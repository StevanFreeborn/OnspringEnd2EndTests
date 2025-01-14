import { Page } from '@playwright/test';
import { BasePrintModal } from './basePrintModal';

export class PrintDashboardModal extends BasePrintModal {
  constructor(page: Page) {
    super(page, 'Print Dashboard');
  }
}
