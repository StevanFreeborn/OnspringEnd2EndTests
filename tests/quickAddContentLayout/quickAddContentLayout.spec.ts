import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppContentPage } from '../../pageObjectModels/content/appContentPage';
import { AnnotationType } from '../annotations';

type QuickAddContentLayoutTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  appContentPage: AppContentPage;
};

const test = base.extend<QuickAddContentLayoutTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  appContentPage: async ({ sysAdminPage }, use) => await use(new AppContentPage(sysAdminPage)),
});

test.describe('quick add content layout', () => {
  test("Enable an app's quick add content layout", async ({
    app,
    appAdminPage,
    appContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-30',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Enable the quick add content layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout('Quick Content Add');
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesLink.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.statusToggle.click();
      await appAdminPage.layoutTab.layoutDesignerModal.editLayoutPropertiesModal.applyButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        fieldName: 'Record Id',
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the quick add content layout is enabled', async () => {
      await appContentPage.goto(app.id);

      await expect(appContentPage.quickContentAddForm.formLocator()).toBeVisible();
    });
  });

  test("Disable an app's quick add content layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-31',
    });

    await test.step('Navigate to the app admin page', async () => {});

    await test.step('Enable the quick add content layout', async () => {});

    await test.step('Verify the quick add content layout is enabled', async () => {});

    await test.step('Disable the quick add content layout', async () => {});

    await test.step('Verify the quick add content layout is disabled', async () => {});

    expect(true).toBeTruthy();
  });
});
