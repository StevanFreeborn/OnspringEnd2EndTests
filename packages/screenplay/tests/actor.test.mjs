import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Actor } from '../dist/index.js';

class CounterAbility {
  constructor(initial = 0) {
    this.count = initial;
  }
}

class UnusedAbility {}

describe('Actor', () => {
  it('creates a named actor with Actor.named', () => {
    const actor = Actor.named('Alice');
    assert.equal(actor.name, 'Alice');
  });

  it('creates an actor with abilities using Actor.whoCan', () => {
    const counter = new CounterAbility(5);
    const actor = Actor.whoCan(counter);

    assert.equal(actor.name, 'User');
    assert.equal(actor.usesAbility(CounterAbility), counter);
  });

  it('throws a descriptive error when an ability is missing', () => {
    const actor = Actor.named('Bob');

    assert.throws(() => actor.usesAbility(UnusedAbility), /Actor "Bob" does not have the ability "UnusedAbility"\./);
  });

  it('executes tasks sequentially in attemptsTo', async () => {
    const order = [];
    const actor = Actor.named('Runner').whoCan(new CounterAbility(0));

    const add = value => async a => {
      await Promise.resolve();
      a.usesAbility(CounterAbility).count += value;
      order.push(value);
    };

    await actor.attemptsTo(add(1), add(2), add(3));

    assert.deepEqual(order, [1, 2, 3]);
    assert.equal(actor.usesAbility(CounterAbility).count, 6);
  });

  it('propagates errors from failing tasks without running subsequent tasks', async () => {
    const actor = Actor.named('Runner').whoCan(new CounterAbility(0));

    const failTask = async () => {
      throw new Error('boom');
    };
    const nextTask = async a => {
      a.usesAbility(CounterAbility).count += 1;
    };

    await assert.rejects(() => actor.attemptsTo(failTask, nextTask), /boom/);
    assert.equal(actor.usesAbility(CounterAbility).count, 0);
  });

  it('answers questions via asks', async () => {
    const actor = Actor.named('Querier').whoCan(new CounterAbility(42));
    const currentCount = a => Promise.resolve(a.usesAbility(CounterAbility).count);

    const answer = await actor.asks(currentCount);
    assert.equal(answer, 42);
  });
});
