import { expect as baseExpect, Locator } from '@playwright/test';

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const expect = baseExpect.extend({
  /**
   * Asserts that the locator is positioned to the left of the relativeLocator.
   * @param locator The main locator to assert.
   * @param relativeLocator The locator to compare against.
   * @param options Optional settings, e.g., timeout.
   */
  async toBeLeftOf(locator: Locator, relativeLocator: Locator, options?: { timeout?: number }) {
    const assertionName = 'toBeLeftOf';
    let pass = false;
    let mainBox: BoundingBox | null = null;
    let relativeBox: BoundingBox | null = null;

    // Use expect.poll to retry the assertion until it passes or times out.
    await baseExpect
      .poll(
        async () => {
          // Get the bounding boxes of both locators.
          mainBox = await locator.boundingBox();
          relativeBox = await relativeLocator.boundingBox();

          // Check if both elements are visible and have bounding boxes.
          if (mainBox && relativeBox) {
            // The main locator is left of the relative locator if its right edge
            // is less than the relative locator's left edge.
            pass = mainBox.x + mainBox.width <= relativeBox.x;
          }
          return pass;
        },
        {
          message: `${locator} to be left of ${relativeLocator}`,
          timeout: options?.timeout,
        }
      )
      .toBeTruthy(); // Use toBeTruthy to assert that 'pass' becomes true.

    const message = () => {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Locator: ${locator}\n` +
        `Relative Locator: ${relativeLocator}\n` +
        `Expected: ${locator} to be left of ${relativeLocator}\n` +
        `Actual: ${mainBox ? `x: ${mainBox.x}, width: ${mainBox.width}` : 'Not found'} | ` +
        `${relativeBox ? `x: ${relativeBox.x}` : 'Not found'}`
      );
    };

    return {
      message,
      pass,
      name: assertionName,
      expected: 'left of',
      actual: 'position relative to ' + relativeLocator,
    };
  },

  /**
   * Asserts that the locator is positioned to the right of the relativeLocator.
   * @param locator The main locator to assert.
   * @param relativeLocator The locator to compare against.
   * @param options Optional settings, e.g., timeout.
   */
  async toBeRightOf(locator: Locator, relativeLocator: Locator, options?: { timeout?: number }) {
    const assertionName = 'toBeRightOf';
    let pass = false;
    let mainBox: BoundingBox | null = null;
    let relativeBox: BoundingBox | null = null;

    await baseExpect
      .poll(
        async () => {
          mainBox = await locator.boundingBox();
          relativeBox = await relativeLocator.boundingBox();

          if (mainBox && relativeBox) {
            // The main locator is right of the relative locator if its left edge
            // is greater than the relative locator's right edge.
            pass = mainBox.x >= relativeBox.x + relativeBox.width;
          }
          return pass;
        },
        {
          message: `${locator} to be right of ${relativeLocator}`,
          timeout: options?.timeout,
        }
      )
      .toBeTruthy();

    const message = () => {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Locator: ${locator}\n` +
        `Relative Locator: ${relativeLocator}\n` +
        `Expected: ${locator} to be right of ${relativeLocator}\n` +
        `Actual: ${mainBox ? `x: ${mainBox.x}` : 'Not found'} | ` +
        `${relativeBox ? `x: ${relativeBox.x}, width: ${relativeBox.width}` : 'Not found'}`
      );
    };

    return {
      message,
      pass,
      name: assertionName,
      expected: 'right of',
      actual: 'position relative to ' + relativeLocator,
    };
  },

  /**
   * Asserts that the locator is positioned above the relativeLocator.
   * @param locator The main locator to assert.
   * @param relativeLocator The locator to compare against.
   * @param options Optional settings, e.g., timeout.
   */
  async toBeAbove(locator: Locator, relativeLocator: Locator, options?: { timeout?: number }) {
    const assertionName = 'toBeAbove';
    let pass = false;
    let mainBox: BoundingBox | null = null;
    let relativeBox: BoundingBox | null = null;

    await baseExpect
      .poll(
        async () => {
          mainBox = await locator.boundingBox();
          relativeBox = await relativeLocator.boundingBox();

          if (mainBox && relativeBox) {
            pass = mainBox.y + mainBox.height <= relativeBox.y;
          }

          return pass;
        },
        {
          message: `${locator} to be above ${relativeLocator}`,
          timeout: options?.timeout,
        }
      )
      .toBeTruthy();

    const message = () => {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Locator: ${locator}\n` +
        `Relative Locator: ${relativeLocator}\n` +
        `Expected: ${locator} to be above ${relativeLocator}\n` +
        `Actual: ${mainBox ? `y: ${mainBox.y}, height: ${mainBox.height}` : 'Not found'} | ` +
        `${relativeBox ? `y: ${relativeBox.y}` : 'Not found'}`
      );
    };

    return {
      message,
      pass,
      name: assertionName,
      expected: 'above',
      actual: 'position relative to ' + relativeLocator,
    };
  },

  /**
   * Asserts that the locator is positioned below the relativeLocator.
   * @param locator The main locator to assert.
   * @param relativeLocator The locator to compare against.
   * @param options Optional settings, e.g., timeout.
   */
  async toBeBelow(locator: Locator, relativeLocator: Locator, options?: { timeout?: number }) {
    const assertionName = 'toBeBelow';
    let pass = false;
    let mainBox: BoundingBox | null = null;
    let relativeBox: BoundingBox | null = null;

    await baseExpect
      .poll(
        async () => {
          mainBox = await locator.boundingBox();
          relativeBox = await relativeLocator.boundingBox();

          if (mainBox && relativeBox) {
            pass = mainBox.y >= relativeBox.y + relativeBox.height;
          }

          return pass;
        },
        {
          message: `${locator} to be below ${relativeLocator}`,
          timeout: options?.timeout,
        }
      )
      .toBeTruthy();

    const message = () => {
      return (
        this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Locator: ${locator}\n` +
        `Relative Locator: ${relativeLocator}\n` +
        `Expected: ${locator} to be below ${relativeLocator}\n` +
        `Actual: ${mainBox ? `y: ${mainBox.y}` : 'Not found'} | ` +
        `${relativeBox ? `y: ${relativeBox.y}, height: ${relativeBox.height}` : 'Not found'}`
      );
    };

    return {
      message,
      pass,
      name: assertionName,
      expected: 'below',
      actual: 'position relative to ' + relativeLocator,
    };
  },
});
