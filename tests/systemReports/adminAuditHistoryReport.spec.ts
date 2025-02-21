import { expect, test } from "../../fixtures";
import { AnnotationType } from "../annotations";

test.describe('admin audit history report', function() {
  test('Filter the Audit History Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-280',
    });

    expect(true).toBeTruthy();
  });
  
  test('Export the Audit History Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-281',
    });

    expect(true).toBeTruthy();
  });
});
