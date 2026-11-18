export enum Increment {
  Minutes = 'Minute(s)',
  Hours = 'Hour(s)',
  Days = 'Day(s)',
  Weeks = 'Week(s)',
  Months = 'Month(s)',
  Years = 'Year(s)',
}

export enum Repetition {
  Once = 'Once',
  Every = 'Every',
  OnceOnDate = 'Once on Date',
}

export enum Timing {
  Before = 'Before',
  After = 'After',
}

export abstract class MessageReminder {
  readonly repetition: Repetition;

  protected constructor({ repetition }: { repetition: Repetition }) {
    this.repetition = repetition;
  }
}

export class OnceOnDateReminder extends MessageReminder {
  readonly dateFieldName: string;

  constructor({ dateFieldName }: { dateFieldName: string }) {
    super({
      repetition: Repetition.OnceOnDate,
    });
    this.dateFieldName = dateFieldName;
  }
}

export class OnceReminder extends MessageReminder {
  readonly quantity: number;
  readonly increment: Increment;
  readonly timing: Timing;

  constructor({ quantity, increment, timing }: { quantity: number; increment: Increment; timing: Timing }) {
    super({
      repetition: Repetition.Once,
    });
    this.quantity = quantity;
    this.increment = increment;
    this.timing = timing;
  }
}

export class EveryReminder extends MessageReminder {
  readonly quantity: number;
  readonly increment: Increment;
  readonly timing: Timing;

  constructor({ quantity, increment }: { quantity: number; increment: Increment }) {
    super({
      repetition: Repetition.Every,
    });
    this.quantity = quantity;
    this.increment = increment;
    this.timing = Timing.After;
  }
}
