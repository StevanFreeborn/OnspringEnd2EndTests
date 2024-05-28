import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

export class PdfParser {
  async findTextInPDF(pdfPath: string, text: string | string[]) {
    const loadingTask = getDocument({ url: pdfPath, verbosity: 0 });
    const pdf = await loadingTask.promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const stringContent = textContent.items.map(item => {
        const textItem = item as TextItem;
        return textItem.str;
      });

      if (Array.isArray(text)) {
        if (text.every(t => stringContent.includes(t))) {
          return true;
        }

        continue;
      }

      if (stringContent.includes(text)) {
        return true;
      }
    }

    return false;
  }
}
