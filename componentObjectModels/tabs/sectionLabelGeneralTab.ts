import { Locator } from '../../fixtures';
import { SectionLabel } from '../../models/sectionLabel';

export class SectionLabelGeneralTab {
  private readonly frame: Locator;
  readonly nameInput: Locator;
  readonly textEditor: Locator;

  constructor(frame: Locator) {
    this.frame = frame;
    this.nameInput = this.frame.getByLabel('Name');
    this.textEditor = this.frame.locator('.content-area.mce-content-body');
  }

  async fillOutGeneralTab(sectionLabel: SectionLabel) {
    await this.nameInput.fill(sectionLabel.name);
    await this.textEditor.fill(sectionLabel.text);
  }
}
