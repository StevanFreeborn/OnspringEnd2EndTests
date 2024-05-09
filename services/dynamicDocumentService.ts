import { Document, Packer } from 'docx';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { FakeDataFactory } from '../factories/fakeDataFactory';

export class DynamicDocumentService {
  async createTemplate(template: Document) {
    const buffer = await Packer.toBuffer(template);
    const templateName = `${FakeDataFactory.createUniqueIdentifier()}-template.docx`;
    const templateDir = path.join(process.cwd(), 'dynamic-documents');

    if (existsSync(templateDir) === false) {
      await mkdir(templateDir);
    }

    const templatePath = path.join(templateDir, templateName);
    await writeFile(templatePath, buffer);
    return templatePath;
  }
}
