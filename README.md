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

Copy the example.env file and rename it to .env

```sh
cp example.env .env
```

Update the .env file with values for your environment

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
