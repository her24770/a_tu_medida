/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MONGODB_URI: string;
  readonly ADMIN_PASSWORD: string;
  readonly ADMIN_SECRET: string;
  readonly R2_ACCOUNT_ID: string;
  readonly R2_ACCESS_KEY_ID: string;
  readonly R2_SECRET_ACCESS_KEY: string;
  readonly R2_BUCKET_NAME: string;
  readonly R2_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
