import { Locator, Page } from '@playwright/test';

type FileTypeSelection = 'PDF' | 'Microsoft Word';

type DocumentActionSelection =
  | 'Email the document to me'
  | 'Save to an attachment field'
  | 'Save to an attachment field and email it to me';

type EmailDeliverySelection = 'Email a link to the document' | 'Attach to the email';

type FillOutFormParams =
  | {
      fileType: FileTypeSelection;
      documentAction: 'Email the document to me' | 'Save to an attachment field and email it to me';
      emailDeliverySelection: EmailDeliverySelection;
    }
  | {
      fileType: FileTypeSelection;
      documentAction: 'Save to an attachment field';
    };

export class GenerateDynamicDocumentModal {
  private readonly modal: Locator;
  private readonly fileTypeSelector: Locator;
  private readonly documentActionSelector: Locator;
  private readonly emailDeliverySelector: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /generate dynamic document/i });
    this.fileTypeSelector = this.modal.locator('.label:has-text("File Type") + .data').getByRole('listbox');
    this.documentActionSelector = this.modal.locator('.label:has-text("Document Action") + .data').getByRole('listbox');
    this.emailDeliverySelector = this.modal.locator('.label:has-text("Email Delivery") + .data').getByRole('listbox');
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
    this.closeButton = this.modal.getByRole('button', { name: 'Close' });
  }

  private async selectFileType(fileType: FileTypeSelection) {
    await this.fileTypeSelector.click();
    await this.fileTypeSelector.page().getByRole('option', { name: fileType }).click();
  }

  private async selectDocumentAction(documentAction: DocumentActionSelection) {
    await this.documentActionSelector.click();
    await this.documentActionSelector.page().getByRole('option', { name: documentAction, exact: true }).click();
  }

  private async selectEmailDelivery(emailDelivery: EmailDeliverySelection) {
    await this.emailDeliverySelector.click();
    await this.emailDeliverySelector.page().getByRole('option', { name: emailDelivery }).click();
  }

  async fillOutForm(params: FillOutFormParams) {
    await this.selectFileType(params.fileType);

    await this.selectDocumentAction(params.documentAction);

    if (params.documentAction !== 'Save to an attachment field') {
      await this.selectEmailDelivery(params.emailDeliverySelection);
    }
  }
}
