# `@stevanfreeborn/onspring-models`

Isomorphic TypeScript domain models and test data factories for Onspring end-to-end test automation.

## Installation

```bash
npm install @stevanfreeborn/onspring-models
```

## Usage

```ts
import { App, FakeDataFactory, TextField } from '@stevanfreeborn/onspring-models';

FakeDataFactory.configure({
  defaultEmailSendingDomain: 'example.com',
  customEmailSendingDomain: 'custom.example.com',
  sysAdminEmail: 'admin@example.com',
});

const app = new App({ name: FakeDataFactory.createFakeAppName() });
const field = new TextField({ name: FakeDataFactory.createFakeFieldName() });
const user = FakeDataFactory.createFakeUser('Active', false);
```

## License

MIT
