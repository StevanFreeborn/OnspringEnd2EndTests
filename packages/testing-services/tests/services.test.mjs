import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';
import { Document, Paragraph } from 'docx';
import { build } from 'node-xlsx';
import { CloudflareService, DownloadService, DynamicDocumentService, SheetParser } from '../dist/index.js';
import { escapeRegExp, toPascalCase } from '@stevanfreeborn/testing-services/utils';

describe('testing-services', () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), 'testing-services-test-'));

  after(() => {
    rmSync(tempRoot, { recursive: true, force: true });
  });

  it('escapes regex characters and converts strings to PascalCase via subpath import', () => {
    assert.equal(escapeRegExp('foo.bar+[baz]?(a|b)'), 'foo\\.bar\\+\\[baz\\]\\?\\(a\\|b\\)');
    assert.equal(toPascalCase('hello WORLD test'), 'HelloWorldTest');
  });

  it('saves binary buffers into nested download directories using DownloadService', async () => {
    const downloadsDir = path.join(tempRoot, 'nested', 'downloads');
    const service = new DownloadService(downloadsDir);
    const payload = new Uint8Array([72, 101, 108, 108, 111]);

    const savedPath = await service.saveBuffer(payload, 'hello.txt');

    assert.ok(savedPath.startsWith(downloadsDir));
    assert.ok(savedPath.endsWith('-hello.txt'));
    assert.equal(readFileSync(savedPath, 'utf8'), 'Hello');
  });

  it('creates .docx templates using DynamicDocumentService', async () => {
    const templateDir = path.join(tempRoot, 'docx-templates');
    const service = new DynamicDocumentService(templateDir);
    const doc = new Document({
      sections: [{ children: [new Paragraph('Hello from test')] }],
    });

    const templatePath = await service.createTemplate(doc);

    assert.ok(existsSync(templatePath));
    assert.ok(templatePath.endsWith('-template.docx'));
    assert.ok(readFileSync(templatePath).byteLength > 0);
  });

  it('parses multi-sheet workbooks with and without headers and guards empty sheets', () => {
    const workbookPath = path.join(tempRoot, 'sample.xlsx');
    const buffer = build([
      {
        name: 'People',
        data: [
          ['Name', 'Role'],
          ['Ada', 'Admin'],
          ['Grace', 'User'],
        ],
        options: {},
      },
      { name: 'Empty', data: [], options: {} },
    ]);
    writeFileSync(workbookPath, buffer);

    const parser = new SheetParser();
    const withHeaders = parser.parseFile(workbookPath, true);
    assert.deepEqual(withHeaders[0], {
      name: 'People',
      data: [
        { Name: 'Ada', Role: 'Admin' },
        { Name: 'Grace', Role: 'User' },
      ],
    });
    assert.deepEqual(withHeaders[1], { name: 'Empty', data: [] });

    const withoutHeaders = parser.parseFile(workbookPath, false);
    assert.deepEqual(withoutHeaders[0].data[0], { 0: 'Name', 1: 'Role' });
  });

  it('sends expected Cloudflare DNS API requests and surfaces HTTP errors', async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];
    let counter = 0;

    globalThis.fetch = async (url, init) => {
      calls.push({ url, method: init?.method, headers: init?.headers, body: init?.body });
      counter += 1;

      if (init?.method === 'DELETE') {
        return new Response(null, { status: 204 });
      }

      return new Response(JSON.stringify({ result: { id: `rec-${counter}` } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    try {
      const cf = new CloudflareService('zone-1', 'secret-token');
      const ids = await cf.addDnsRecordsForCustomDomain({
        ownershipRecord: { name: '_verify', type: 'TXT', value: 'v=1' },
        dkimRecord: { name: 'dkim._domainkey', type: 'TXT', value: 'k=rsa' },
        returnPathRecord: { name: 'bounce', type: 'CNAME', value: 'mail.example.com' },
      });

      assert.deepEqual(ids, {
        ownershipRecordId: 'rec-1',
        dkimRecordId: 'rec-2',
        returnPathRecordId: 'rec-3',
      });
      assert.equal(calls.length, 3);
      assert.equal(calls[0].headers.Authorization, 'Bearer secret-token');

      await cf.deleteDnsRecord('rec-1');
      assert.equal(calls[3].method, 'DELETE');
      assert.ok(String(calls[3].url).endsWith('/zones/zone-1/dns_records/rec-1'));

      globalThis.fetch = async () => new Response('Forbidden', { status: 403, statusText: 'Forbidden' });
      await assert.rejects(() => cf.deleteDnsRecord('rec-1'), /Cloudflare API request failed: Forbidden/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
