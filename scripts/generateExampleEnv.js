import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

run().catch(err => {
  console.error(err);
  process.exit(1);
});

async function run() {
  const envConfig = dotenv.parse(readFileSync(join(process.cwd(), '.env')));
  const exampleEnv = Object.keys(envConfig)
    .map(key => `${key}=\n`)
    .join('');
  writeFileSync(join(process.cwd(), 'example.env'), exampleEnv);
}
