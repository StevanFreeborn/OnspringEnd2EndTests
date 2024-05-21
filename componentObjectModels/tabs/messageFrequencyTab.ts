import { Locator, Page } from '@playwright/test';
import {
  EveryReminder,
  Increment,
  MessageReminder,
  OnceOnDateReminder,
  OnceReminder,
  Repetition,
} from '../../models/messageReminder';
import { SendOnSaveOption } from './../../models/message';

export abstract class MessageFrequencyTab {
  private readonly sendOnSaveSelect: Locator;
  private readonly remindersCheckbox: Locator;
  private readonly remindersDateFieldSelect: Locator;
  private readonly remindersContainer: Locator;
  private readonly addReminderLink: Locator;

  constructor(page: Page) {
    this.sendOnSaveSelect = page.getByRole('listbox', { name: 'Send on Save' });
    this.remindersCheckbox = page.getByLabel('Send reminder(s) based on the following date/time field');
    this.remindersDateFieldSelect = page.locator('.reminder-field-container').getByRole('listbox');
    this.remindersContainer = page.locator('.reminders-container');
    this.addReminderLink = page.getByRole('link', { name: 'Add a Reminder' });
  }

  async selectSendOnSaveFrequency(option: SendOnSaveOption) {
    await this.sendOnSaveSelect.click();
    await this.sendOnSaveSelect.page().getByRole('option', { name: option }).click();
  }

  async enableReminders(dateField: string) {
    await this.remindersCheckbox.click();
    await this.remindersDateFieldSelect.click();
    await this.remindersDateFieldSelect.page().getByRole('option', { name: dateField }).click();
  }

  async addReminders(reminders: MessageReminder[]) {
    const [firstReminder, ...rest] = reminders;

    await this.addReminder(firstReminder, false);

    for (const reminder of rest) {
      await this.addReminder(reminder);
    }
  }

  protected async selectReminderRepetition(reminder: Locator, repetition: Repetition) {
    await reminder.getByRole('listbox').click();
    await reminder.page().getByRole('option', { name: repetition }).click();
  }

  protected async fillReminderQuantity(reminderDetail: Locator, quantity: number) {
    await reminderDetail.locator('k-numerictextbox input:visible').fill(quantity.toString());
  }

  protected async selectReminderIncrement(reminderDetail: Locator, increment: Increment) {
    await reminderDetail.getByRole('listbox').first().click();
    await reminderDetail.page().getByRole('option', { name: increment }).click();
  }

  protected async addReminder(reminder: MessageReminder, clickAddReminder = true) {
    const reminderLocator = this.remindersContainer.locator('.reminder').last();
    const reminderDetails = reminderLocator.locator('.reminder-details');

    if (clickAddReminder) {
      await this.addReminderLink.click();
    }

    if (reminder instanceof OnceOnDateReminder) {
      return await this.selectReminderRepetition(reminderLocator, reminder.repetition);
    }

    if (reminder instanceof OnceReminder) {
      await this.selectReminderRepetition(reminderLocator, reminder.repetition);
      await this.fillReminderQuantity(reminderDetails, reminder.quantity);
      await this.selectReminderIncrement(reminderDetails, reminder.increment);
      await reminderDetails.getByRole('listbox').last().click();
      return await reminderDetails.page().getByRole('option', { name: reminder.timing }).click();
    }

    if (reminder instanceof EveryReminder) {
      await this.selectReminderRepetition(reminderLocator, reminder.repetition);
      await this.fillReminderQuantity(reminderDetails, reminder.quantity);
      return await this.selectReminderIncrement(reminderDetails, reminder.increment);
    }

    throw new Error('Invalid reminder type');
  }
}
