# OnspringEnd2EndTests

A suite of automated web app tests for the [Onspring](https://onspring.com/) platform using:

- [TypeScript](https://www.typescriptlang.org/)
- [Playwright](https://playwright.dev)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (latest LTS version)
- [npm](https://www.npmjs.com/) (latest LTS version)

### Installation

#### 👨🏻‍💻 Clone the repo

```sh
git clone https://github.com/StevanFreeborn/OnspringEnd2EndTests.git
```

#### 💾 Install NPM packages

```sh
npm install
```

#### 🎭 Install Playwright Dependencies

```sh
npx playwright install
```

#### 📝 Create .env file

Copy the `example.env` file and rename it to `.env`

```sh
cp example.env .env
```

Update the `.env` file with values for your environment

## Usage

### Run all tests

```sh
npm run test
```

### Run all tests for specific browser

```sh
npx run test:chrome
```

-- or --

```sh
npx run test -- --project=chrome
```

### Run a specific suite of tests

```sh
npm run test -- app.spec.ts
```

### Run a specific test

```sh
npm run test -- -g "Delete a user"
```

### Learn more about Playwright's Test CLI

[Playwright CLI](https://playwright.dev/docs/test-cli)

## Workflows

### [Playwright_Tests](./.github/workflows/playwright.yml)

This workflow runs the Playwright tests in a GitHub Actions workflow and allows you to supply an environment variable for the environment you want to run the tests against. It will only run when directly triggered by a user.

### [Lint_and_Format](./.github/workflows/lint_format.yml)

This workflow runs ESLint and Prettier against the codebase to ensure code quality and consistency. It will run on any pull request that merges into the `master` branch.

### [Acceptance_Test](./.github/workflows/accept_tests.yml)

This workflow will run on any pull request that aims to merge into the `master` branch. It will run all the tests found in `.spec.ts` files changed by the PR a total of 3 times in a row without retries to ensure the tests are stable.
