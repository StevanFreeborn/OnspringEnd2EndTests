import { env } from '../env';
import { DownloadService } from '../services/downloadService';
import { EmailService } from '../services/emailService';
import { PdfParser } from '../services/pdfParser';

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