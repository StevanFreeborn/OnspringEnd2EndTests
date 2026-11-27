import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BrowseTheWeb, resolveTarget, WebActor } from '../dist/index.js';

function createFakeLocator(overrides = {}) {
  const calls = [];
  const locator = {
    calls,
    async click() {
      calls.push(['click']);
    },
    async clear() {
      calls.push(['clear']);
    },
    async pressSequentially(value, options) {
      calls.push(['pressSequentially', value, options]);
    },
    async innerText() {
      return '  Trimmed Text \n';
    },
    ...overrides,
  };
  return locator;
}

function createFakePage(overrides = {}) {
  const calls = [];
  return {
    calls,
    async goto(url) {
      calls.push(['goto', url]);
    },
    async evaluate(fn, arg) {
      calls.push(['evaluate', fn, arg]);
      return `value-for-${arg}`;
    },
    locator(selector) {
      return createFakeLocator({ selector });
    },
    ...overrides,
  };
}

describe('screenplay-playwright', () => {
  it('resolves both direct Locator targets and factory targets', () => {
    const page = createFakePage();
    const direct = createFakeLocator();

    assert.equal(resolveTarget(page, direct), direct);

    const factoryResolved = resolveTarget(page, p => p.locator('#save'));
    assert.equal(factoryResolved.selector, '#save');
  });

  it('equips WebActor with BrowseTheWeb and shares BrowserActions instance', () => {
    const page = createFakePage();
    const actor = WebActor.using('Alice', page);

    assert.equal(actor.name, 'Alice');
    assert.equal(BrowseTheWeb.as(actor), page);
    assert.equal(actor.browse(), actor.usesAbility(BrowseTheWeb).to);
  });

  it('delegates BrowserActions goto, click, getText, and getSessionStorageItem', async () => {
    const page = createFakePage();
    const locator = createFakeLocator();
    const actor = WebActor.using('Alice', page);

    await actor.browse().goto('/Admin/App');
    await actor.browse().click(() => locator);
    const text = await actor.browse().getText(locator);
    const stored = await actor.browse().getSessionStorageItem('gridState');

    assert.deepEqual(page.calls[0], ['goto', '/Admin/App']);
    assert.deepEqual(locator.calls, [['click']]);
    assert.equal(text, 'Trimmed Text');
    assert.equal(stored, 'value-for-gridState');
  });

  it('supports BrowserActions type clearing by default and skipping clear when clear is false', async () => {
    const page = createFakePage();
    const locator = createFakeLocator();
    const actor = WebActor.using('Alice', page);

    await actor.browse().type(locator, 'abc');
    await actor.browse().type(locator, 'xyz', { clear: false, delay: 0 });

    assert.deepEqual(locator.calls, [
      ['clear'],
      ['pressSequentially', 'abc', { delay: 100 }],
      ['pressSequentially', 'xyz', { delay: 0 }],
    ]);
  });

  it('exposes containsText on TargetAssertions and doesNotHaveUrl on PageAssertions', () => {
    const page = createFakePage();
    const locator = createFakeLocator();
    const actor = WebActor.using('Alice', page);

    assert.equal(typeof actor.browse().check(locator).containsText, 'function');
    assert.equal(typeof actor.browse().checkPage().doesNotHaveUrl, 'function');
  });
});
