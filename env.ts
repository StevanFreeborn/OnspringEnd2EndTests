import { z } from 'zod';

const envSchema = z
  .object({
    CI: z.boolean().default(false),
    SYS_ADMIN_USERNAME: z.string().min(1),
    SYS_ADMIN_PASSWORD: z.string().min(1),
    SYS_ADMIN_FIRST_NAME: z.string().min(1),
    SYS_ADMIN_LAST_NAME: z.string().min(1),
    SYS_ADMIN_EMAIL: z.string().min(1),
    TEST_ENV: z.union([
      z.literal('ALPHA'),
      z.literal('BETA'),
      z.literal('QA'),
      z.literal('IST'),
      z.literal('VPRIOR'),
      z.literal('VNEXT'),
      z.literal('PROD'),
    ]),
    ALPHA_INSTANCE_URL: z.string(),
    BETA_INSTANCE_URL: z.string(),
    QA_INSTANCE_URL: z.string(),
    IST_INSTANCE_URL: z.string(),
    VPRIOR_INSTANCE_URL: z.string(),
    VNEXT_INSTANCE_URL: z.string(),
    PROD_INSTANCE_URL: z.string(),
  })
  .refine(data => {
    const testEnv = data.TEST_ENV;
    const instanceUrl = data[`${testEnv}_INSTANCE_URL`];

    if (instanceUrl === undefined) {
      return false;
    }

    return true;
  }, 'Instance URL must be defined for the specified test environment.');

export const env = envSchema.parse(process.env);
