import { Locator, Page } from '@playwright/test';
import { WaitForOptions } from '../../utils';
import { DateFieldControl } from '../controls/dateFieldControl';

export class ViewVersionHistoryModal {
  private readonly filterPathRegex: RegExp;
  private readonly _modal: Locator;
  private readonly fromDateField: DateFieldControl;
  private readonly toDateField: DateFieldControl;
  private readonly versionsGridBody: Locator;

  modal() {
    return this._modal;
  }

  constructor(page: Page) {
    this.filterPathRegex = /\/Content\/\d+\/\d+\/GetRecordVersionsPage/;
    this._modal = page.getByRole('dialog', { name: 'Version History' });
    this.fromDateField = new DateFieldControl(this._modal.locator('.k-datetimepicker').first());
    this.toDateField = new DateFieldControl(this._modal.locator('.k-datetimepicker').last());
    this.versionsGridBody = this._modal.locator('.k-grid-content');
  }

  async waitFor(options?: WaitForOptions) {
    await this._modal.waitFor(options);
  }

  async filterBy({ fromDate, toDate }: { fromDate: Date; toDate: Date }) {
    const page = this._modal.page();

    const fromFilterResponse = page.waitForResponse(
      res => {
        const requestData = res.request().postDataJSON();
        const hasFromDate = requestData.fromDate !== undefined;
        return res.url().match(this.filterPathRegex) !== null && res.request().method() === 'POST' && hasFromDate;
      }
    );

    await this.fromDateField.enterDate(fromDate);
    await fromFilterResponse;

    const toFilterResponse = page.waitForResponse(
      res => {
        const requestData = res.request().postDataJSON();
        const hasToDate = requestData.toDate !== undefined;
        return res.url().match(this.filterPathRegex) !== null && res.request().method() === 'POST' && hasToDate;
      }
    );

    await this.toDateField.enterDate(toDate);
    await toFilterResponse;
  }

  async getVersionRows() {
    return this.versionsGridBody.getByRole('row').all();
  }
}
