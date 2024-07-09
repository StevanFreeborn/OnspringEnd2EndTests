/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
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
  request: async ({ apiURL, setup }, use) => await createRequestContextFixture({ apiUrl: `${apiURL}/v1/`, setup }, use),
});

test.describe('API v1', () => {
  test.describe('Ping', () => {
    test('it should return 204 status code', async ({ request }) => {
      const response = await request.get('ping');
      expect(response.status()).toBe(204);
    });
  });

  test.describe('Get Apps', () => {
    test('it should return expected status code and data structure', async ({ request }) => {
      const response = await request.get('apps');

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);

      for (const app of body) {
        const expectedAppProperties = [
          {
            name: 'Id',
            value: expect.any(Number),
          },
          {
            name: 'Name',
            value: expect.any(String),
          },
        ];

        for (const prop of expectedAppProperties) {
          expect(app).toHaveProperty(prop.name, prop.value);
        }
      }
    });
  });

  test.describe('Get Fields By AppId', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      const response = await request.get(`fields?appId=${setup.app.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);

      for (const field of body) {
        for (const prop of expectedFieldProperties) {
          expect(field).toHaveProperty(prop.name, prop.value);
        }

        // list field
        if (field.Type === 400) {
          expect(field).toHaveProperty('Multiplicity', expect.any(Number));

          const values = field.Values;

          expect(Array.isArray(values)).toBe(true);

          for (const value of values) {
            for (const prop of expectedListValueProperties) {
              if (value[prop.name] === null) {
                continue;
              }

              expect(value).toHaveProperty(prop.name, prop.value);
            }
          }
        }

        // reference field
        if (field.Type === 500) {
          expect(field).toHaveProperty('Multiplicity', expect.any(Number));
        }

        // formula field
        if (field.Type === 900) {
          expect(field).toHaveProperty('OutputType', expect.any(Number));

          const values = field.Values;

          expect(Array.isArray(values)).toBe(true);

          for (const value of values) {
            for (const prop of expectedListValueProperties) {
              if (value[prop.name] === null) {
                continue;
              }

              expect(value).toHaveProperty(prop.name, prop.value);
            }
          }
        }
      }
    });
  });

  test.describe('Get Field By Field Id', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      const response = await request.get(`fields/${setup.fields.statusField.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const prop of expectedFieldProperties) {
        expect(body).toHaveProperty(prop.name, prop.value);
      }

      const values = body.Values;

      expect(Array.isArray(values)).toBe(true);

      for (const value of values) {
        for (const prop of expectedListValueProperties) {
          if (value[prop.name] === null) {
            continue;
          }

          expect(value).toHaveProperty(prop.name, prop.value);
        }
      }
    });
  });

  test.describe('Get Records By App Id', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get records', async () => {
        const response = await request.get(`records/${setup.app.id}`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(Array.isArray(body)).toBe(true);

        for (const record of body) {
          expect(record).toHaveProperty('AppId', expect.any(Number));
          expect(record).toHaveProperty('RecordId', expect.any(Number));

          const fieldData = record.FieldData;

          expect(Array.isArray(fieldData)).toBe(true);

          for (const field of fieldData) {
            expect(field).toHaveProperty('Type', expect.any(Number));
            expect(field).toHaveProperty('FieldId', expect.any(Number));
            expect(field).toHaveProperty('Value');
          }
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Get Record By Id', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Get the record', async () => {
        const response = await request.get(`records/${setup.app.id}/${createdRecordId}`);

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty('AppId', expect.any(Number));
        expect(body).toHaveProperty('RecordId', expect.any(Number));

        const fieldData = body.FieldData;

        expect(Array.isArray(fieldData)).toBe(true);

        for (const field of fieldData) {
          expect(field).toHaveProperty('Type', expect.any(Number));
          expect(field).toHaveProperty('FieldId', expect.any(Number));
          expect(field).toHaveProperty('Value');
        }
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Add A Record', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      const response = await request.post(`records/${setup.app.id}`, {
        data: {
          FieldData: {
            [setup.fields.nameField.id]: 'Test Record',
          },
        },
      });

      expect(response.status()).toBe(201);

      const body = await response.json();

      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('recordId', expect.any(Number));
    });
  });

  test.describe('Update A Record', () => {
    test('it should return expected status code', async ({ request, setup }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record', async () => {
        const response = await request.put(`records/${setup.app.id}/${createdRecordId}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Updated Test Record',
            },
          },
        });

        expect(response.status()).toBe(204);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Update A Record With Attachment', () => {
    test('it should return expected status code and data structure', async ({ setup, request, txtFile }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record with attachment', async () => {
        const file = await readFile(txtFile.path);

        const response = await request.post(
          `files/${setup.app.id}/${createdRecordId}/${setup.fields.attachmentsField.id}`,
          {
            data: file,
            params: {
              fileName: txtFile.name,
              modifiedTime: new Date().toISOString(),
              fileNotes: 'Test file notes',
            },
          }
        );

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty('fileId', expect.any(Number));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Update A Record With Image', () => {
    test('it should return expected status code and data structure', async ({ setup, request, jpgFile }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Update the record with image', async () => {
        const file = await readFile(jpgFile.path);

        const response = await request.post(`files/${setup.app.id}/${createdRecordId}/${setup.fields.imageField.id}`, {
          data: file,
          params: {
            fileName: jpgFile.name,
            modifiedTime: new Date().toISOString(),
            fileNotes: 'Test file notes',
          },
        });

        expect(response.status()).toBe(201);

        const body = await response.json();

        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty('fileId', expect.any(Number));
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Get An Attachment', () => {
    test('it should return expected status code and data', async ({ setup, request, txtFile }) => {
      let createdRecordId = 0;
      let createdFileId = 0;

      const file = await readFile(txtFile.path);

      await test.step('Create a record with attachment', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);

        const fileResponse = await request.post(
          `files/${setup.app.id}/${createdRecordId}/${setup.fields.attachmentsField.id}`,
          {
            data: file,
            params: {
              fileName: txtFile.name,
              modifiedTime: new Date().toISOString(),
              fileNotes: 'Test file notes',
            },
          }
        );

        if (fileResponse.status() !== 201) {
          throw new Error('Failed to add attachment');
        }

        const fileBody = await fileResponse.json();

        createdFileId = parseInt(fileBody.fileId);

        expect(createdFileId).toBeGreaterThan(0);
      });

      await test.step('Get the attachment', async () => {
        const response = await request.get(
          `files/${setup.app.id}/${createdRecordId}/${setup.fields.attachmentsField.id}?fileId=${createdFileId}`
        );

        expect(response.status()).toBe(200);

        const body = await response.body();

        expect(body).toEqual(file);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Get An Image', () => {
    test('it should return expected status code and data', async ({ setup, request, jpgFile }) => {
      let createdRecordId = 0;
      let createdFileId = 0;

      const file = await readFile(jpgFile.path);

      await test.step('Create a record with image', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);

        const fileResponse = await request.post(
          `files/${setup.app.id}/${createdRecordId}/${setup.fields.imageField.id}`,
          {
            data: file,
            params: {
              fileName: jpgFile.name,
              modifiedTime: new Date().toISOString(),
              fileNotes: 'Test file notes',
            },
          }
        );

        if (fileResponse.status() !== 201) {
          throw new Error('Failed to add image');
        }

        const fileBody = await fileResponse.json();

        createdFileId = parseInt(fileBody.fileId);

        expect(createdFileId).toBeGreaterThan(0);
      });

      await test.step('Get the image', async () => {
        const response = await request.get(
          `files/${setup.app.id}/${createdRecordId}/${setup.fields.imageField.id}?fileId=${createdFileId}`
        );

        expect(response.status()).toBe(200);

        const body = await response.body();

        expect(body).toEqual(file);
      });

      await test.step('Delete the record', async () => {
        await request.delete(`records/${setup.app.id}/${createdRecordId}`);
      });
    });
  });

  test.describe('Delete A Record', () => {
    test('it should return expected status code', async ({ request, setup }) => {
      let createdRecordId = 0;

      await test.step('Create a record', async () => {
        const response = await request.post(`records/${setup.app.id}`, {
          data: {
            FieldData: {
              [setup.fields.nameField.id]: 'Test Record',
            },
          },
        });

        if (response.status() !== 201) {
          throw new Error('Failed to create record');
        }

        const body = await response.json();
        createdRecordId = parseInt(body.recordId);

        expect(createdRecordId).toBeGreaterThan(0);
      });

      await test.step('Delete the record', async () => {
        const response = await request.delete(`records/${setup.app.id}/${createdRecordId}`);

        expect(response.status()).toBe(204);
      });
    });
  });

  test.describe('Get Reports By App Id', () => {
    test('it should return expected status code and data structure', async ({ request, setup }) => {
      const response = await request.get(`reports?appId=${setup.app.id}`);

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);

      for (const report of body) {
        expect(report).toHaveProperty('Id', expect.any(Number));
        expect(report).toHaveProperty('AppId', setup.app.id);
        expect(report).toHaveProperty('Name', expect.any(String));
      }
    });
  });

  test.describe('Get Report Data By Id', () => {});
});

const expectedFieldProperties = [
  {
    name: 'Id',
    value: expect.any(Number),
  },
  {
    name: 'AppId',
    value: expect.any(Number),
  },
  {
    name: 'IsRequired',
    value: expect.any(Boolean),
  },
  {
    name: 'IsUnique',
    value: expect.any(Boolean),
  },
  {
    name: 'Name',
    value: expect.any(String),
  },
  {
    name: 'Status',
    value: expect.any(Number),
  },
  {
    name: 'Type',
    value: expect.any(Number),
  },
];

const expectedListValueProperties = [
  {
    name: 'Id',
    value: expect.any(String),
  },
  {
    name: 'Name',
    value: expect.any(String),
  },
  {
    name: 'SortOrder',
    value: expect.any(Number),
  },
  {
    name: 'NumericValue',
    value: expect.any(Number),
  },
  {
    name: 'Color',
    value: expect.any(String),
  },
];
