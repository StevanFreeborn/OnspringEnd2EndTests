import { randomUUID } from 'crypto';
import { Document, Packer } from 'docx';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export class DynamicDocumentService {
  private readonly templateDir: string;

  constructor(templateDir = path.join(process.cwd(), 'dynamic-documents')) {
    this.templateDir = templateDir;
  }

  async createTemplate(template: Document): Promise<string> {
    const buffer = await Packer.toBuffer(template);
    const templateName = `${randomUUID()}-template.docx`;

    if (existsSync(this.templateDir) === false) {
      await mkdir(this.templateDir, { recursive: true });
    }

    const templatePath = path.join(this.templateDir, templateName);
    await writeFile(templatePath, buffer);
    return templatePath;
  }
}
