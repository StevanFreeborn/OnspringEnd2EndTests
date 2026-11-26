# `@stevanfreeborn/testing-services`

Reusable Node.js testing services and utilities for end-to-end automation (Cloudflare DNS, downloads, `.docx` template generation, IMAP email queries, PDF text search, remote file caching, SFTP, Excel sheet parsing, and string helpers).

## Installation

```bash
npm install @stevanfreeborn/testing-services
```

If you use `DownloadService.saveDownload(download)` with Playwright's `Download` type, also install `@playwright/test`.

## Subpath Imports

To avoid loading heavy optional integrations (such as IMAP, PDF.js, or SFTP) when you only need specific helpers, import from dedicated subpaths:

- `@stevanfreeborn/testing-services/cloudflare`
- `@stevanfreeborn/testing-services/download`
- `@stevanfreeborn/testing-services/dynamic-document`
- `@stevanfreeborn/testing-services/email`
- `@stevanfreeborn/testing-services/pdf`
- `@stevanfreeborn/testing-services/remote-files`
- `@stevanfreeborn/testing-services/sftp`
- `@stevanfreeborn/testing-services/sheet`
- `@stevanfreeborn/testing-services/utils`

## License

MIT
