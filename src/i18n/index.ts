import en from './en.json';
import nl from './nl.json';

export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];
export type Page = '' | 'experience' | '3d-printing' | '404';
export const translations: Record<Locale, typeof en> = { en, nl };
export const pageUrl = (locale: Locale, page: Page = '') =>
  `/${locale}/${page ? `${page}/` : ''}`;
