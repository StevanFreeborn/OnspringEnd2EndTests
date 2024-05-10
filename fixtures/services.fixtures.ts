import { env } from '../env';
import { DownloadService } from '../services/downloadService';
import { DynamicDocumentService } from '../services/dynamicDocumentService';
import { EmailService } from '../services/emailService';
import { PdfParser } from '../services/pdfParser';
import { SheetParser } from '../services/sheetParser';

export async function sysAdminEmailService({}, use: (r: EmailService) => Promise<void>) {
  const imapConfig = {
    user: env.SYS_ADMIN_EMAIL,
    password: env.SYS_ADMIN_EMAIL_PASSWORD,
    host: env.SYS_ADMIN_EMAIL_HOST,
    port: env.SYS_ADMIN_EMAIL_PORT,
    tls: true,
    tlsOptions: { servername: env.SYS_ADMIN_EMAIL_HOST },
  };
  const emailService = new EmailService(imapConfig);
  await use(emailService);
}

export async function pdfParser({}, use: (r: PdfParser) => Promise<void>) {
  const pdfParser = new PdfParser();
  await use(pdfParser);
}

export async function downloadService({}, use: (r: DownloadService) => Promise<void>) {
  const downloadService = new DownloadService();
  await use(downloadService);
}

export async function sheetParser({}, use: (r: SheetParser) => Promise<void>) {
  const sheetParser = new SheetParser();
  await use(sheetParser);
}

export async function dynamicDocumentService({}, use: (r: DynamicDocumentService) => Promise<void>) {
  const dynamicDocumentService = new DynamicDocumentService();
  await use(dynamicDocumentService);
}
