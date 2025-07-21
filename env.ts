import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    CI: z
      .string()
      .transform(v => (!v ? undefined : v))
      .default('false'),
    SYS_ADMIN_USERNAME: z.string().min(1),
    SYS_ADMIN_PASSWORD: z.string().min(1),
    SYS_ADMIN_FIRST_NAME: z.string().min(1),
    SYS_ADMIN_LAST_NAME: z.string().min(1),
    SYS_ADMIN_EMAIL: z.string().min(1),
    SYS_ADMIN_EMAIL_PASSWORD: z.string().min(1),
    SYS_ADMIN_EMAIL_HOST: z.string().min(1),
    SYS_ADMIN_EMAIL_PORT: z.coerce.number(),
    TEST_ENV: z.union([
      z.literal('ALPHA'),
      z.literal('BETA'),
      z.literal('QA'),
      z.literal('IST'),
      z.literal('VPRIOR'),
      z.literal('VNEXT'),
      z.literal('PROD'),
      z.literal('FEDSPRING_IST'),
      z.literal('AZURE'),
    ]),
    RECORD_HAR: z.enum(['true', 'false', 'TRUE', 'FALSE']).transform(v => v.toLowerCase() === 'true'),
    ALPHA_INSTANCE_URL: z.string(),
    BETA_INSTANCE_URL: z.string(),
    QA_INSTANCE_URL: z.string(),
    IST_INSTANCE_URL: z.string(),
    VPRIOR_INSTANCE_URL: z.string(),
    VNEXT_INSTANCE_URL: z.string(),
    PROD_INSTANCE_URL: z.string(),
    FEDSPRING_IST_INSTANCE_URL: z.string(),
    AZURE_INSTANCE_URL: z.string(),
    PLAYWRIGHT_SERVICE_RUN_ID: z
      .string()
      .transform(v => (!v ? undefined : v))
      .optional(),
    PLAYWRIGHT_SERVICE_OS: z
      .string()
      .transform(v => (!v ? undefined : v))
      .optional(),
    PLAYWRIGHT_SERVICE_WORKERS: z
      .string()
      .transform(v => (!v ? undefined : v))
      .optional(),
    PLAYWRIGHT_SERVICE_URL: z
      .string()
      .transform(v => (!v ? undefined : v))
      .optional(),
    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: z
      .string()
      .transform(v => (!v ? undefined : v))
      .optional(),
    BITSIGHT_API_KEY: z.string().min(1),
    SFDC_HOSTNAME: z.string().min(1),
    SFDC_USERNAME: z.string().min(1),
    SFDC_PASSWORD: z.string().min(1),
  })
  .refine(data => {
    const testEnv = data.TEST_ENV;
    const instanceUrl = data[`${testEnv}_INSTANCE_URL`];

    if (!instanceUrl) {
      return false;
    }

    return true;
  }, 'Instance URL must be defined for the specified test environment.');

export const env = envSchema.parse(process.env);
