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

### Run tests against specific target environment

A helpful script to run tests against a specific target environment without having to alter the `.env` file. Note you can pass all the same arguments as you would to `npm run test` to this script. But note the `--target` argument should come first followed by `--` and then the rest of the arguments you want to pass to the test script.

```sh
npm run test:env --target=<target> -- -- emailBody.spec.ts --project chrome
```

### Learn more about Playwright's Test CLI

[Playwright CLI](https://playwright.dev/docs/test-cli)

## Workflows

### [Playwright_Tests](./.github/workflows/playwright.yml)

This workflow runs the Playwright tests in a GitHub Actions workflow and allows you to supply an environment variable for the environment you want to run the tests against. It will only run when directly triggered by a user.

### [Lint_and_Format](./.github/workflows/lint_format.yml)

This workflow runs ESLint and Prettier against the codebase to ensure code quality and consistency. It will run on any pull request that merges into the `master` branch.

### [Acceptance_Test](./.github/workflows/accept_tests.yml)

This workflow will run on any pull request that aims to merge into the `master` branch. It will run all the tests found in `.spec.ts` files changed by the PR a total of 3 times in a row allowing for 1 retry to ensure the tests are stable. Making the allowance for 1 retry is an effort to reduce the number of false negatives due to transient timeouts.

## Relevant Notes

### SFTP Testing

Some tests require the ability to upload a file to an SFTP server. This is currently done using the [`ssh2-sftp-client`](https://www.npmjs.com/package/ssh2-sftp-client) package. This library is used to connect to the SFTP server and upload files as part of the test setup and teardown. The SFTP server connection details can be configured in the `.env` file.

### Email Testing

Some tests require the ability to verify that an email was sent. This is currently done using IMAP and the `imap` package. You can read more about it [here](https://www.npmjs.com/package/imap). The email account for the system administrator user running the tests can be configured in the `.env` file.

When it is necessary to verify an email was sent to specific user currently an alias (e.g. `system.admin+<some unique identifier>@gmail.com`) is used to send the email to the system administrator user. The system administrator user's email account is configured in the `.env` file. The alias is then used to filter the emails in the inbox to find the email sent to the specific user.

### PDF Testing

Some tests require the ability to verify the contents of a PDF. This is currently done using the [`PDF.js`](https://mozilla.github.io/pdf.js/) package. This library is used to parse the PDF after it has been downloaded.

### Excel Testing

Some tests require the ability to verify the contents of an Excel file. This is currently done using the [`node-xlsx`](https://www.npmjs.com/package/node-xlsx) package. This library is used to parse the Excel file after it has been downloaded.

### Screenshot Testing

Playwright supports asserting against screenshots. This is a powerful feature that can be used to verify the visual appearance of a page or part of a page. You can read about it [here](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1). However when using this feature in a test you will need to generate a baseline screenshot to assert against. This screenshot will need to be committed to the repository. This screenshot by default will be generated the first time you run the test and an existing screenshot does not exist. The screenshot can be subsequently regenerated or updated by running the test with the `--update-snapshots` flag. Make sure that you have specified the exact test you want to update the snapshot for when using this flag.

Screenshots are also specific to the browser and operating system you are running the tests on. So you will need to generate a screenshot for each browser and operating system you want to test against. This is important to keep in mind when attempting to add or update tests that use this feature. The CI/CD pipeline will run the tests on a Linux machine so you will need to make sure that Linux screenshots are generated and committed to the repository as part of the test development process.

The easiest way to generate the screenshots for the CI/CD pipeline is to run the tests locally using Docker and the Playwright Docker image. Below is an example:

```powershell
docker run --rm --network host -v "$(pwd):/work/" -w /work/ -it mcr.microsoft.com/playwright:{INSERT PROPER IMAGE VERSION HERE} /bin/bash
```

> [!NOTE]
> You can find the Playwright Docker image that is used by the CI/CD pipeline in the [acceptance test workflow](./.github/workflows/accept_tests.yml) and the [playwright tests workflow](./.github/workflows/playwright.yml).
