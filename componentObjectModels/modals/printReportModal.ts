import { Page } from '@playwright/test';
import { BasePrintModal } from './basePrintModal';

export class PrintReportModal extends BasePrintModal {
  constructor(page: Page) {
    super(page, 'Print Report');
  }
}
