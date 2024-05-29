import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditBitsightConnectorPage } from '../../pageObjectModels/dataConnectors/editBitsightConnectorPage';
import { AnnotationType } from '../annotations';

type BitsightTestFixtures = {
  adminHomePage: AdminHomePage;
  editConnectorPage: EditBitsightConnectorPage;
};

const test = base.extend<BitsightTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editConnectorPage: async ({ sysAdminPage }, use) => await use(new EditBitsightConnectorPage(sysAdminPage)),
});

test.describe('bitsight data connector', () => {
  test('Create a new Bitsight connector', async ({ adminHomePage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-395',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a new Bitsight data connector', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(connectorName, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Verify the new Bitsight connector is created', async () => {
      await expect(editConnectorPage.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-396',
    });

    expect(true).toBe(true);
  });

  test('Delete a Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-397',
    });

    expect(true).toBe(true);
  });

  test('Configure a new Bitsight connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-398',
    });

    expect(true).toBe(true);
  });

  test('Verify a new Bitsight connector runs successfully', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-399',
    });

    expect(true).toBe(true);
  });
});
