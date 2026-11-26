# `@stevanfreeborn/screenplay`

A lightweight, zero-dependency TypeScript implementation of the Screenplay Pattern.

## Installation

```bash
npm install @stevanfreeborn/screenplay
```

## Core Concepts

- **`Actor`**: Represents a user or system interacting with the application under test. Holds `Ability` instances and runs `Task`s (`attemptsTo`) and `Question`s (`asks`).
- **`Ability`**: A capability granted to an actor (e.g., browser automation or HTTP access).
- **`Task<TActor>`**: A reusable command `(actor: TActor) => Promise<void>`.
- **`Question<TActor, TAnswer>`**: A query `(actor: TActor) => Promise<TAnswer>`.

## Usage

```ts
import { Ability, Actor, Question, Task } from '@stevanfreeborn/screenplay';

class SayHello implements Ability {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}

const askGreeting = (): Question<Actor, string> => async actor => actor.usesAbility(SayHello).greet(actor.name);

const actor = Actor.named('Ada').whoCan(new SayHello());
const message = await actor.asks(askGreeting());
```

## License

MIT
