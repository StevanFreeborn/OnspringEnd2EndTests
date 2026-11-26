import {
  DownloadService,
  DynamicDocumentService,
  EmailService,
  PdfParser,
  RemoteTestFileService,
  SftpService,
  SheetParser,
} from '@stevanfreeborn/testing-services';
import { env } from '../env';

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

export async function remoteTestFileService({}, use: (r: RemoteTestFileService) => Promise<void>) {
  const remoteTestFileService = new RemoteTestFileService();
  await use(remoteTestFileService);
}

export async function dynamicDocumentService({}, use: (r: DynamicDocumentService) => Promise<void>) {
  const dynamicDocumentService = new DynamicDocumentService();
  await use(dynamicDocumentService);
}

export async function sftpService({}, use: (r: SftpService) => Promise<void>) {
  const sftpService = new SftpService({
    host: env.SFDC_HOSTNAME,
    port: 22,
    username: env.SFDC_USERNAME,
    password: env.SFDC_PASSWORD,
  });

  await use(sftpService);
}
