/**
 * Marker interface for capabilities an Actor can possess (e.g., BrowseTheWeb, CallAnApi).
 */
export interface Ability {
  readonly name?: string;
}

/**
 * Constructor type for an Ability class.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type AbilityType<T extends Ability = Ability> = Function & { prototype: T };

/**
 * A reusable task that an Actor can perform to cause a state change or side effect.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Task<TActor = any> = (actor: TActor) => Promise<void>;

/**
 * A question that queries information from the application state without causing side effects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Question<TActor = any, TAnswer = any> = (actor: TActor) => Promise<TAnswer>;

/**
 * Represents a user or system interacting with the application under test.
 */
export class Actor {
  readonly name: string;
  private readonly abilities = new Map<AbilityType, Ability>();

  protected constructor(name: string) {
    this.name = name;
  }

  /**
   * Creates a new Actor with the given name.
   */
  static named(name: string): Actor {
    return new Actor(name);
  }

  /**
   * Creates an Actor with the given Abilities.
   */
  static whoCan(...abilities: Ability[]): Actor {
    return new Actor('User').whoCan(...abilities);
  }

  /**
   * Grants one or more Abilities to this Actor.
   */
  whoCan(...abilities: Ability[]): this {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor as AbilityType, ability);
    }
    return this;
  }

  /**
   * Retrieves an Ability of the given type, throwing if the Actor does not possess it.
   */
  usesAbility<T extends Ability>(abilityType: AbilityType<T>): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`Actor "${this.name}" does not have the ability "${abilityType.name}".`);
    }
    return ability as T;
  }

  /**
   * Executes one or more Tasks in sequence.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async attemptsTo(...tasks: Task<any>[]): Promise<void> {
    for (const task of tasks) {
      await task(this);
    }
  }

  /**
   * Asks a Question to retrieve information from the application.
   */
  async asks<TAnswer>(question: Question<this, TAnswer>): Promise<TAnswer> {
    return await question(this);
  }
}
