import assert from 'node:assert/strict';
import { after, describe, it } from 'node:test';
import {
  AppPermission,
  DisplayField,
  FakeDataFactory,
  Role,
  SecureFileDataConnector,
  TEST_APP_NAME,
  User,
} from '../dist/index.js';

describe('onspring-models', () => {
  after(() => {
    FakeDataFactory.configure({
      defaultEmailSendingDomain: 'onspring.tech',
      customEmailSendingDomain: 'custom.onspring.tech',
      sysAdminEmail: 'automation@onspring.tech',
    });
  });

  it('configures FakeDataFactory domains and admin email for derived generators', () => {
    FakeDataFactory.configure({
      defaultEmailSendingDomain: 'mail.example.org',
      customEmailSendingDomain: 'sending.example.org',
      sysAdminEmail: 'qa@example.org',
    });

    assert.equal(FakeDataFactory.createFakeEmailFromAddress('bot'), 'bot@mail.example.org');
    assert.match(FakeDataFactory.createFakeCustomEmailSendingDomain(), /^\d+-[a-f0-9]+\.sending\.example\.org$/);
    assert.match(FakeDataFactory.createFakeUserEmail(), /^qa\+\d+-[a-f0-9]+@example\.org$/);
  });

  it('generates unique identifiers, app names, and compliant passwords', () => {
    const id1 = FakeDataFactory.createUniqueIdentifier();
    const id2 = FakeDataFactory.createUniqueIdentifier();
    const appName = FakeDataFactory.createFakeAppName();
    const password = FakeDataFactory.createFakePassword();

    assert.notEqual(id1, id2);
    assert.ok(appName.endsWith(`-${TEST_APP_NAME}`));
    assert.ok(password.endsWith('Aa1'));
    assert.ok(password.length >= 10);
  });

  it('builds POSIX remote file paths cleanly across OS conventions', () => {
    const makeConnector = (fileLocation, fileName = 'data.csv') =>
      new SecureFileDataConnector({
        name: 'Connector',
        status: false,
        app: 'Tasks',
        hostname: 'sftp.example.com',
        port: 22,
        fileLocation,
        fileName,
        fileType: 'CSV (Comma delimited)',
        authType: { type: 'Username / Password', username: 'u', password: 'p' },
        startingOnDate: new Date('2026-01-01T00:00:00Z'),
        frequency: 'Every Day',
      });

    assert.equal(makeConnector('./').filePath(), 'data.csv');
    assert.equal(makeConnector('/').filePath(), '/data.csv');
    assert.equal(makeConnector('/inbox/').filePath(), '/inbox/data.csv');
    assert.equal(makeConnector('inbox\\daily').filePath(), 'inbox/daily/data.csv');
    assert.equal(makeConnector('').filePath(), 'data.csv');
  });

  it('requires notification targets when SecureFileDataConnector is enabled', () => {
    assert.throws(
      () =>
        new SecureFileDataConnector({
          name: 'EnabledConnector',
          status: true,
          app: 'Tasks',
          hostname: 'sftp.example.com',
          port: 22,
          fileLocation: './',
          fileName: 'data.csv',
          fileType: 'CSV (Comma delimited)',
          authType: { type: 'Username / Password' },
          startingOnDate: new Date(),
          frequency: 'Every Day',
        }),
      /must have at least one notification user or one notification group/
    );
  });

  it('constructs User, Role, AppPermission, and DisplayField defaults', () => {
    const user = new User({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      username: 'ada',
      password: 'Secret123',
    });
    assert.equal(user.fullName, 'Ada Lovelace');

    const role = new Role({ name: 'Reviewer', appPermissions: [new AppPermission({ appName: 'App A' })] });
    assert.equal(role.status, 'Inactive');
    assert.equal(role.appPermissions[0].contentRecords.read, false);

    const displayField = new DisplayField({ name: 'Status' });
    assert.equal(displayField.alias, 'Status');
    assert.equal(displayField.display, 'Report & Quick Edit');
  });
});
