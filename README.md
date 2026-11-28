# OnspringEnd2EndTests

A suite of automated web application tests for the [Onspring](https://onspring.com/) platform using:

- [TypeScript](https://www.typescriptlang.org/)
- [Playwright](https://playwright.dev)
- [Screenplay Pattern](docs/architecture.md)

For conceptual Screenplay design rules, see the [Architecture Guide](docs/architecture.md). For contributor workflows, code placement, conventions, and pre-PR checks, see the [Contributing Guide](CONTRIBUTING.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (latest LTS version)
- [npm](https://www.npmjs.com/) (latest LTS version)

### Installation

#### 👨🏻‍💻 Clone the repo

```sh
git clone https://github.com/StevanFreeborn/OnspringEnd2EndTests.git
```

#### 💾 Install dependencies

```sh
npm install
```

#### 🔨 Build packages

```sh
npm run build:packages
```

#### 🎭 Install Playwright browser binaries

```sh
npx playwright install
```

#### 📝 Create .env file

Copy the `example.env` file and rename it to `.env`:

```sh
cp example.env .env
```

Update the `.env` file with values for your target test environment.

## Usage

### Run all tests

```sh
npm run test
```

### Run tests for a specific browser

```sh
npm run test -- --project=chrome
```

### Run a specific test suite or file

```sh
npm run test -- app.spec.ts
```

### Run a specific test by title

```sh
npm run test -- -g "Delete a user"
```

### Run tests against a specific target environment

```sh
npm run test:env --target=<target> -- -- app.spec.ts --project chrome
```

### Build packages

```sh
npm run build:packages
```

### Typecheck and lint

```sh
npm run lint
```

## Stagehand

**Stagehand** ([tools/stagehand/README.md](tools/stagehand/README.md)) is the repository's backstage CLI & multi-runner orchestrator for test authoring, live UI exploration, Help Center lookup, and architectural guardrail verification:

```sh
# See which headless coding runners are installed
npm run stagehand -- runners

# Preview normalized test briefs from a GitHub issue (expands unchecked Test-NNN items)
npm run stagehand -- ingest --issue 325

# Implement and verify all tests in an issue sequentially on an isolated shared branch
npm run stagehand -- run --issue 325 --shared-branch feat/survey-answer-field --domain fields --cleanup-worktree
```

See the full guide in [Stagehand Documentation](tools/stagehand/README.md) for CSV/Markdown/YAML/Onspring API adapters, `--resume`, `--verbose`, live UI exploration (`explore --script`), and `verify`.

## Workflows

### [Playwright_Tests](./.github/workflows/playwright.yml)

Runs Playwright tests in GitHub Actions and allows supplying an environment variable for the target environment. Only runs when manually triggered.

### [Lint_and_Format](./.github/workflows/lint_format.yml)

Builds workspace packages, runs package unit tests, and runs ESLint and Prettier across the codebase to ensure code quality and consistency. Runs on any pull request targeting `master`.

### [Acceptance_Test](./.github/workflows/accept_tests.yml)

Runs on pull requests targeting `master`. Executes tests changed by the pull request up to 3 times with 1 retry to ensure stability.

## Additional Testing Guides

### SFTP Testing

Some tests verify file upload to an SFTP server using `ssh2-sftp-client`. SFTP connection details are configured in `.env`.

### Email Testing

Some tests verify email delivery using IMAP. The system administrator email credentials and alias patterns are configured in `.env`.

### PDF & Excel Testing

Tests verify downloaded file contents using `pdfjs-dist` for PDF documents and `node-xlsx` for Excel spreadsheets.

### Visual Screenshot Testing

Playwright supports asserting against baseline screenshots. Baseline snapshots are generated automatically or updated using:

```sh
npm run test -- -g "Exact Test Name" --update-snapshots
```

To generate platform-consistent Linux snapshots locally, run the tests using the Playwright Docker image:

```powershell
docker run --rm --network host -v "$(pwd):/work/" -w /work/ -it mcr.microsoft.com/playwright:{PLAYWRIGHT_VERSION} /bin/bash
```
