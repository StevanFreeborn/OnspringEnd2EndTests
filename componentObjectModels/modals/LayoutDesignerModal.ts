import { FrameLocator, Locator, Page } from '@playwright/test';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';
import { AddFieldModal } from './addFieldModal';

export class LayoutDesignerModal {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;
  readonly addFieldModal: AddFieldModal;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog');
    this.frame = this.designer.frameLocator('iframe').first();
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new CanvasSection(this.frame);
    this.addFieldModal = new AddFieldModal(page);
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
  }
}
