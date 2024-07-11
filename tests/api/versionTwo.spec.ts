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
