/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SITE_ENV?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
