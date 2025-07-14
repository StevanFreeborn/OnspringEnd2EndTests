/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { APIRequestContext, test as base, expect } from '../../fixtures';
import { ApiSetupResult, createApiSetupFixture, createRequestContextFixture } from '../../fixtures/api.fixtures';

type VersionOneTestFixtures = {
  request: APIRequestContext;
};

type VersionOneWorkerFixtures = {
  setup: ApiSetupResult;
};

const test = base.extend<VersionOneTestFixtures, VersionOneWorkerFixtures>({
  setup: [async ({}, use) => await createApiSetupFixture(use), { scope: 'worker' }],
  request: async ({ apiURL, setup }, use) => await createRequestContextFixture({ apiUrl: apiURL, setup }, use),
});

test.describe('API v2', () => {
  test.describe('Ping', () => {
    test('it should return 200 status code', async ({ request }) => {
      const response = await request.get('ping');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Get Apps', () => {
    test('it should return expected status code and data structure', async ({ request }) => {
      const response = await request.get('apps');

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedPaginationProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }

      for (const item of body.items) {
        for (const property of expectedAppProperties) {
          expect(item).toHaveProperty(property.name, property.value);
        }
      }
    });
  });

  test.describe('Get App By App Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.get(`apps/id/${setup.app.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedAppProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }
    });
  });

  test.describe('Get Apps By App Ids', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.post('apps/batch-get', {
        data: [setup.app.id],
      });

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('count', expect.any(Number));

      for (const item of body.items) {
        for (const property of expectedAppProperties) {
          expect(item).toHaveProperty(property.name, property.value);
        }
      }
    });
  });

  test.describe('Get Fields By App Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.get(`fields/appId/${setup.app.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedPaginationProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }

      for (const item of body.items) {
        for (const property of expectedFieldProperties) {
          expect(item).toHaveProperty(property.name, property.value);
        }

        if (item.type === 'List') {
          expect(item).toHaveProperty('multiplicity', expect.any(String));

          for (const value of item.values) {
            for (const property of expectedListValueProperties) {
              expect(value).toHaveProperty(property.name, property.value);
            }
          }
        }

        if (item.type === 'Reference') {
          expect(item).toHaveProperty('multiplicity', expect.any(String));
          expect(item).toHaveProperty('referencedAppId', expect.any(Number));
        }

        if (item.type === 'Formula') {
          expect(item).toHaveProperty('outputType', expect.any(String));

          for (const value of item.values) {
            for (const property of expectedListValueProperties) {
              expect(value).toHaveProperty(property.name, property.value);
            }
          }
        }
      }
    });
  });

  test.describe('Get Field By Field Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.get(`fields/id/${setup.fields.statusField.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedFieldProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }

      if (body.type === 'List') {
        expect(body).toHaveProperty('multiplicity', expect.any(String));

        for (const value of body.values) {
          for (const property of expectedListValueProperties) {
            expect(value).toHaveProperty(property.name, property.value);
          }
        }
      }

      if (body.type === 'Reference') {
        expect(body).toHaveProperty('multiplicity', expect.any(String));
        expect(body).toHaveProperty('referencedAppId', expect.any(Number));
      }

      if (body.type === 'Formula') {
        expect(body).toHaveProperty('outputType', expect.any(String));

        for (const value of body.values) {
          for (const property of expectedListValueProperties) {
            expect(value).toHaveProperty(property.name, property.value);
          }
        }
      }
    });
  });

  test.describe('Get Fields By Field Ids', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.post('fields/batch-get', {
        data: Object.values(setup.fields).map(f => f.id),
      });

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body).toHaveProperty('count', expect.any(Number));

      for (const item of body.items) {
        for (const property of expectedFieldProperties) {
          expect(item).toHaveProperty(property.name, property.value);
        }

        if (item.type === 'List') {
          expect(item).toHaveProperty('multiplicity', expect.any(String));

          for (const value of item.values) {
            for (const property of expectedListValueProperties) {
              expect(value).toHaveProperty(property.name, property.value);
            }
          }
        }

        if (item.type === 'Reference') {
          expect(item).toHaveProperty('multiplicity', expect.any(String));
          expect(item).toHaveProperty('referencedAppId', expect.any(Number));
        }

        if (item.type === 'Formula') {
          expect(item).toHaveProperty('outputType', expect.any(String));

          for (const value of item.values) {
            for (const property of expectedListValueProperties) {
              expect(value).toHaveProperty(property.name, property.value);
            }
          }
        }
      }
    });
  });

  test.describe('Get Records By App Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get records', async () => {
        const response = await request.get(`records/appId/${setup.app.id}`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        for (const property of expectedPaginationProperties) {
          expect(body).toHaveProperty(property.name, property.value);
        }

        for (const item of body.items) {
          for (const property of expectedRecordProperties) {
            expect(item).toHaveProperty(property.name, property.value);
          }

          for (const fieldData of item.fieldData) {
            for (const property of expectedFieldDataProperties) {
              expect(fieldData).toHaveProperty(property.name, property.value);
            }
          }
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Record By Record Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get record', async () => {
        const response = await request.get(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        for (const property of expectedRecordProperties) {
          expect(body).toHaveProperty(property.name, property.value);
        }

        for (const fieldData of body.fieldData) {
          for (const property of expectedFieldDataProperties) {
            expect(fieldData).toHaveProperty(property.name, property.value);
          }
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Records By Record Ids', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get records', async () => {
        const response = await request.post(`records/batch-get`, {
          data: {
            appId: setup.app.id,
            recordIds: [createdRecordId],
          },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('count', expect.any(Number));

        for (const item of body.items) {
          for (const property of expectedRecordProperties) {
            expect(item).toHaveProperty(property.name, property.value);
          }

          for (const fieldData of item.fieldData) {
            for (const property of expectedFieldDataProperties) {
              expect(fieldData).toHaveProperty(property.name, property.value);
            }
          }
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Records By Query', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const recordName = 'Test Record';
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: recordName,
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get records', async () => {
        const response = await request.post(`records/query`, {
          data: {
            appId: setup.app.id,
            filter: `${setup.fields.nameField.id} eq '${recordName}'`,
          },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        for (const property of expectedPaginationProperties) {
          expect(body).toHaveProperty(property.name, property.value);
        }

        for (const item of body.items) {
          for (const property of expectedRecordProperties) {
            expect(item).toHaveProperty(property.name, property.value);
          }

          for (const fieldData of item.fieldData) {
            for (const property of expectedFieldDataProperties) {
              expect(fieldData).toHaveProperty(property.name, property.value);
            }
          }
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Image File Info', () => {
    test('it should return expected status code and data structure', async ({ setup, request, jpgFile }) => {
      const file = createReadStream(jpgFile.path);
      let createdRecordId = 0;
      let createdImageFileId = 0;

      await test.step('Create a record with an image', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
              [setup.fields.imageField.id]: {
                fileName: 'test-image.jpg',
                fileType: 'image/jpeg',
                data: 'base64-encoded-image-data',
              },
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.imageField.id,
            modifiedDate: new Date().toISOString(),
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create image file');
        }

        const createFileBody = await createFileResponse.json();
        createdImageFileId = parseInt(createFileBody.id);

        expect(createdImageFileId).toBeGreaterThan(0);
      });

      await test.step('Get image file info', async () => {
        const response = await request.get(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.imageField.id}/fileId/${createdImageFileId}`
        );

        expect(response.status()).toBe(200);

        const body = await response.json();

        for (const property of expectedFileInfoProperties) {
          expect(body).toHaveProperty(property.name, property.value);
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Image File', () => {
    test('it should return expected status code and data', async ({ setup, request, jpgFile }) => {
      const fileBuffer = await readFile(jpgFile.path);
      const file = createReadStream(jpgFile.path);
      let createdRecordId = 0;
      let createdImageFileId = 0;

      await test.step('Create a record with an image', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.imageField.id,
            modifiedDate: new Date().toISOString(),
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create image file');
        }

        const createFileBody = await createFileResponse.json();
        createdImageFileId = parseInt(createFileBody.id);
      });

      await test.step('Get image file', async () => {
        const response = await request.get(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.imageField.id}/fileId/${createdImageFileId}/file`
        );

        expect(response.status()).toBe(200);

        const buffer = await response.body();

        expect(buffer).toEqual(fileBuffer);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Attachment File Info', () => {
    test('it should return expected status code and data structure', async ({ setup, request, txtFile }) => {
      const file = createReadStream(txtFile.path);
      let createdRecordId = 0;
      let createdAttachmentFileId = 0;

      await test.step('Create a record with an attachment', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Test Attachment',
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create attachment file');
        }

        const createFileBody = await createFileResponse.json();
        createdAttachmentFileId = parseInt(createFileBody.id);
      });

      await test.step('Get attachment file info', async () => {
        const response = await request.get(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.attachmentsField.id}/fileId/${createdAttachmentFileId}`
        );

        expect(response.status()).toBe(200);

        const body = await response.json();

        for (const property of expectedFileInfoProperties) {
          expect(body).toHaveProperty(property.name, property.value);
        }

        expect(body).toHaveProperty('notes', expect.any(String));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Attachment File', () => {
    test('it should return expected status code and data', async ({ setup, request, txtFile }) => {
      const fileBuffer = await readFile(txtFile.path);
      const file = createReadStream(txtFile.path);
      let createdRecordId = 0;
      let createdAttachmentFileId = 0;

      await test.step('Create a record with an attachment', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Test Attachment',
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create attachment file');
        }

        const createFileBody = await createFileResponse.json();
        createdAttachmentFileId = parseInt(createFileBody.id);
      });

      await test.step('Get attachment file', async () => {
        const response = await request.get(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.attachmentsField.id}/fileId/${createdAttachmentFileId}/file`
        );

        expect(response.status()).toBe(200);

        const buffer = await response.body();

        expect(buffer).toEqual(fileBuffer);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Reports By App Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.get(`reports/appId/${setup.app.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedPaginationProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }

      for (const item of body.items) {
        expect(item).toHaveProperty('id', expect.any(Number));
        expect(item).toHaveProperty('appId', expect.any(Number));
        expect(item).toHaveProperty('name', expect.any(String));
      }
    });
  });

  test.describe('Get A Report By Report Id', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const testRecords = [{ appId: setup.app.id, fields: { [setup.fields.nameField.id]: 'Test Record' } }];
      const createdRecordIds: number[] = [];

      await test.step('Create report data', async () => {
        for (const record of testRecords) {
          const response = await request.put(`records`, {
            data: record,
          });

          if (response.status() !== 201) {
            throw new Error('Failed to create record');
          }

          const body = await response.json();
          createdRecordIds.push(parseInt(body.id));
        }
      });

      await test.step('Get report data', async () => {
        const response = await request.get(`reports/id/${setup.report.id}`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('columns', expect.any(Array));
        expect(body).toHaveProperty('rows', expect.any(Array));

        const expectedColumns = Object.values(setup.fields).map(f => f.name);
        expect(body.columns).toEqual(expect.arrayContaining(expectedColumns));

        expect(body.rows.length).toBeGreaterThanOrEqual(testRecords.length);

        for (const row of body.rows) {
          expect(row).toHaveProperty('recordId', expect.any(Number));
          expect(row).toHaveProperty('cells', expect.any(Array));

          for (const cell of row.cells) {
            expect(cell).toBeDefined();
          }
        }
      });

      await test.step('Delete report data', async () => {
        for (const recordId of createdRecordIds) {
          await request.delete(`records/appId/${setup.app.id}/recordId/${recordId}`);
        }
      });
    });
  });

  test.describe('Create A Record', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      const response = await request.put(`records`, {
        data: {
          appId: setup.app.id,
          fields: {
            [setup.fields.nameField.id]: 'Test Record',
          },
        },
      });

      expect(response.status()).toBe(201);

      const body = await response.json();

      expect(body).toHaveProperty('id', expect.any(Number));
      expect(body).toHaveProperty('warnings', expect.any(Array));
    });
  });

  test.describe('Update A Record', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record', async () => {
        const response = await request.put('records', {
          data: {
            appId: setup.app.id,
            recordId: createdRecordId,
            fields: {
              [setup.fields.nameField.id]: 'Updated Test Record',
            },
          },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('id', createdRecordId);
        expect(body).toHaveProperty('warnings', expect.any(Array));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Update Record With Image', () => {
    test('it should return expected status code and data structure', async ({ setup, request, jpgFile }) => {
      const file = createReadStream(jpgFile.path);
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record with an image', async () => {
        const response = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.imageField.id,
            modifiedDate: new Date().toISOString(),
            file: file,
          },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toHaveProperty('id', expect.any(Number));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Update Record With Attachment', () => {
    test('it should return expected status code and data structure', async ({ setup, request, txtFile }) => {
      const file = createReadStream(txtFile.path);
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record with an attachment', async () => {
        const response = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Test Attachment',
            file: file,
          },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toHaveProperty('id', expect.any(Number));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });

    test('it should return expected status code and data structure when uploading a large file', async ({
      setup,
      request,
      large45mbTxtFile,
    }) => {
      const file = createReadStream(large45mbTxtFile.path);
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record with a large attachment', async () => {
        const response = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Large Test Attachment',
            file: file,
          },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toHaveProperty('id', expect.any(Number));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });

    test('it should return expected status code when updating a record with an attachment that exceeds the size limit', async ({
      setup,
      request,
      large51mbTxtFile,
      environment,
    }) => {
      const file = createReadStream(large51mbTxtFile.path);
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Attempt to update the record with an oversized attachment', async () => {
        const response = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Oversized Test Attachment',
            file: file,
          },
        });

        expect(response.status()).toBe(environment.isFedspring() ? 403 : 413);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Delete A Record', () => {
    test('it should return expected status code', async ({ setup, request }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.id);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Delete the record', async () => {
        const response = await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);

        expect(response.status()).toBe(204);
      });
    });
  });

  test.describe('Delete Records', () => {
    test('it should return expected status code', async ({ setup, request }) => {
      const testRecords = [{ appId: setup.app.id, fields: { [setup.fields.nameField.id]: 'Test Record' } }];
      const createdRecordIds: number[] = [];

      await test.step('Create records', async () => {
        for (const record of testRecords) {
          const response = await request.put(`records`, {
            data: record,
          });

          if (response.status() !== 201) {
            throw new Error('Failed to create record');
          }

          const body = await response.json();
          createdRecordIds.push(parseInt(body.id));
        }
      });

      await test.step('Delete records', async () => {
        const response = await request.post('records/batch-delete', {
          data: {
            appId: setup.app.id,
            recordIds: createdRecordIds,
          },
        });

        expect(response.status()).toBe(204);
      });
    });
  });

  test.describe('Delete An Image File', () => {
    test('it should return expected status code', async ({ setup, request, jpgFile }) => {
      const file = createReadStream(jpgFile.path);
      let createdRecordId = 0;
      let createdImageFileId = 0;

      await test.step('Create a record with an image', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.imageField.id,
            modifiedDate: new Date().toISOString(),
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create image file');
        }

        const createFileBody = await createFileResponse.json();
        createdImageFileId = parseInt(createFileBody.id);
      });

      await test.step('Delete the image file', async () => {
        const response = await request.delete(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.imageField.id}/fileId/${createdImageFileId}`
        );

        expect(response.status()).toBe(204);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Delete An Attachment File', () => {
    test('it should return expected status code', async ({ setup, request, txtFile }) => {
      const file = createReadStream(txtFile.path);
      let createdRecordId = 0;
      let createdAttachmentFileId = 0;

      await test.step('Create a record with an attachment', async () => {
        const createRecordResponse = await request.put(`records`, {
          data: {
            appId: setup.app.id,
            fields: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (createRecordResponse.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const createRecordBody = await createRecordResponse.json();
        createdRecordId = parseInt(createRecordBody.id);

        expect(createdRecordId).toBeGreaterThan(0);

        const createFileResponse = await request.post('files', {
          multipart: {
            recordId: createdRecordId,
            fieldId: setup.fields.attachmentsField.id,
            modifiedDate: new Date().toISOString(),
            notes: 'Test Attachment',
            file: file,
          },
        });

        if (createFileResponse.status() !== 201) {
          throw new Error('Failed to create attachment file');
        }

        const createFileBody = await createFileResponse.json();
        createdAttachmentFileId = parseInt(createFileBody.id);
      });

      await test.step('Delete the attachment file', async () => {
        const response = await request.delete(
          `files/recordId/${createdRecordId}/fieldId/${setup.fields.attachmentsField.id}/fileId/${createdAttachmentFileId}`
        );

        expect(response.status()).toBe(204);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/appId/${setup.app.id}/recordId/${createdRecordId}`);
      });
    });
  });

  test.describe('Add List Value to List', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let listId = 0;
      let createdListValueId = '';

      await test.step('Get list id', async () => {
        const response = await request.get(`fields/id/${setup.fields.statusField.id}`);

        if (response.status() !== 200) {
          throw new Error('Failed to get field');
        }

        const body = await response.json();

        listId = body.listId;

        expect(listId).toBeGreaterThan(0);
      });

      await test.step('Add list value to list', async () => {
        const response = await request.put(`lists/id/${listId}/items`, {
          data: {
            name: 'Test List Value',
            numericValue: 1,
            color: '#000000',
          },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toHaveProperty('id', expect.any(String));

        createdListValueId = body.id;
      });

      await test.step('Delete the list value', async () => {
        await request.delete(`lists/id/${listId}/itemId/${createdListValueId}`);
      });
    });
  });

  test.describe('Update List Value In List', () => {
    test('it should return expected status code and data structure', async ({ setup, request }) => {
      let listId = 0;
      let createdListValueId = '';

      await test.step('Get list id', async () => {
        const response = await request.get(`fields/id/${setup.fields.statusField.id}`);

        if (response.status() !== 200) {
          throw new Error('Failed to get field');
        }

        const body = await response.json();

        listId = body.listId;

        expect(listId).toBeGreaterThan(0);
      });

      await test.step('Add list value to list', async () => {
        const response = await request.put(`lists/id/${listId}/items`, {
          data: {
            name: 'Test List Value',
            numericValue: 1,
            color: '#000000',
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to add list value');
        }

        const body = await response.json();

        createdListValueId = body.id;
      });

      await test.step('Update list value in list', async () => {
        const response = await request.put(`lists/id/${listId}/items`, {
          data: {
            id: createdListValueId,
            name: 'Updated Test List Value',
            numericValue: 2,
            color: '#FFFFFF',
          },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('id', createdListValueId);
      });

      await test.step('Delete the list value', async () => {
        await request.delete(`lists/id/${listId}/itemId/${createdListValueId}`);
      });
    });
  });

  test.describe('Delete List Value From List', () => {
    test('it should return expected status code', async ({ setup, request }) => {
      let listId = 0;
      let createdListValueId = '';

      await test.step('Get list id', async () => {
        const response = await request.get(`fields/id/${setup.fields.statusField.id}`);

        if (response.status() !== 200) {
          throw new Error('Failed to get field');
        }

        const body = await response.json();

        listId = body.listId;

        expect(listId).toBeGreaterThan(0);
      });

      await test.step('Add list value to list', async () => {
        const response = await request.put(`lists/id/${listId}/items`, {
          data: {
            name: 'Test List Value',
            numericValue: 1,
            color: '#000000',
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to add list value');
        }

        const body = await response.json();

        createdListValueId = body.id;
      });

      await test.step('Delete the list value', async () => {
        const response = await request.delete(`lists/id/${listId}/itemId/${createdListValueId}`);

        expect(response.status()).toBe(204);
      });
    });
  });
});

const expectedAppProperties = [
  {
    name: 'id',
    value: expect.any(Number),
  },
  {
    name: 'href',
    value: expect.any(String),
  },
  {
    name: 'name',
    value: expect.any(String),
  },
];

const expectedPaginationProperties = [
  {
    name: 'pageNumber',
    value: expect.any(Number),
  },
  {
    name: 'pageSize',
    value: expect.any(Number),
  },
  {
    name: 'totalPages',
    value: expect.any(Number),
  },
  {
    name: 'totalRecords',
    value: expect.any(Number),
  },
  {
    name: 'items',
    value: expect.any(Array),
  },
];

const expectedFieldProperties = [
  {
    name: 'id',
    value: expect.any(Number),
  },
  {
    name: 'appId',
    value: expect.any(Number),
  },
  {
    name: 'isRequired',
    value: expect.any(Boolean),
  },
  {
    name: 'isUnique',
    value: expect.any(Boolean),
  },
  {
    name: 'name',
    value: expect.any(String),
  },
  {
    name: 'status',
    value: expect.any(String),
  },
  {
    name: 'type',
    value: expect.any(String),
  },
];

const expectedListValueProperties = [
  {
    name: 'id',
    value: expect.any(String),
  },
  {
    name: 'name',
    value: expect.any(String),
  },
  {
    name: 'sortOrder',
    value: expect.any(Number),
  },
  {
    name: 'numericValue',
    value: expect.any(Number),
  },
  {
    name: 'color',
    value: expect.any(String),
  },
];

const expectedRecordProperties = [
  {
    name: 'appId',
    value: expect.any(Number),
  },
  {
    name: 'recordId',
    value: expect.any(Number),
  },
  {
    name: 'fieldData',
    value: expect.any(Array),
  },
];

const expectedFieldDataProperties = [
  {
    name: 'type',
    value: expect.any(String),
  },
  {
    name: 'fieldId',
    value: expect.any(Number),
  },
  {
    name: 'value',
    value: expect.anything(),
  },
];

const expectedFileInfoProperties = [
  {
    name: 'type',
    value: expect.any(String),
  },
  {
    name: 'contentType',
    value: expect.any(String),
  },
  {
    name: 'name',
    value: expect.any(String),
  },
  {
    name: 'createdDate',
    value: expect.any(String),
  },
  {
    name: 'modifiedDate',
    value: expect.any(String),
  },
  {
    name: 'owner',
    value: expect.any(String),
  },
  {
    name: 'fileHref',
    value: expect.any(String),
  },
];
