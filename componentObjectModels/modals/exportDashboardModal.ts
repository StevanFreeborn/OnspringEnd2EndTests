import { Page } from '@playwright/test';
import { BasePrintModal } from './basePrintModal';

export class ExportDashboardModal extends BasePrintModal {
  constructor(page: Page) {
    super(page, 'Export Dashboard');
  }
}
