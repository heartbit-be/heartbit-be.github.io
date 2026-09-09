import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const output = resolve('dist');
const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : join(directory, entry.name),
      ),
    )
  ).flat();
};
const files = await walk(output);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const pageNames = ['', 'experience', '3d-printing', '404'];
const routes = [
  'index.html',
  'experience/index.html',
  '3d-printing/index.html',
  '404.html',
  ...['en', 'nl'].flatMap((lang) =>
    pageNames.map((page) => `${lang}/${page ? `${page}/` : ''}index.html`),
  ),
];
assert.equal(htmlFiles.length, routes.length, 'Unexpected published pages');
for (const path of routes) {
  assert(files.includes(join(output, path)), `Missing route: ${path}`);
}
const pages = new Map(
  await Promise.all(
    htmlFiles.map(async (file) => [file, await readFile(file, 'utf8')]),
  ),
);
for (const file of htmlFiles) {
  const html = pages.get(file);
  const route = routes.find((route) => join(output, route) === file);
  const lang = route.startsWith('nl/') ? 'nl' : 'en';
  const pagePath = `/${route}`.replace(/index\.html$/, '');
  const page = pagePath
    .replace(/^\/(en|nl)\//, '/')
    .replace(/^\/|\/$/g, '')
    .replace('404.html', '404');
  assert.match(
    html,
    new RegExp(`<html[^>]*lang="${lang}"`),
    `${file}: language missing`,
  );
  const localizedPath = `/${lang}/${page ? `${page}/` : ''}`;
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${file}: expected one page heading`,
  );
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title missing`);
  assert.match(html, /name="description"/, `${file}: description missing`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert(
    canonical ===
      new URL(localizedPath, process.env.SITE_URL || 'https://heartbit.be')
        .href,
    `${file}: wrong canonical origin`,
  );
  const noindex = /name="robots" content="noindex, nofollow"/.test(html);
  assert.equal(
    noindex,
    process.env.PUBLIC_SITE_ENV === 'staging' || page === '404',
    `${file}: wrong indexing policy`,
  );
  const navigation = html.match(
    /<nav[^>]*data-main-navigation[^>]*>([\s\S]*?)<\/nav>/,
  )?.[1];
  assert(navigation, `${file}: main navigation missing`);
  assert.deepEqual(
    [...navigation.matchAll(/href="([^"]+)"/g)].map(([, href]) => href),
    [`/${lang}/`, `/${lang}/experience/`, `/${lang}/3d-printing/`],
    `${file}: wrong main navigation`,
  );
  const currentPages = [
    ...navigation.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g),
  ];
  assert.equal(
    currentPages.length,
    page === '404' ? 0 : 1,
    `${file}: wrong current navigation item count`,
  );
  if (currentPages.length)
    assert(
      currentPages[0][0].includes(`href="${localizedPath}"`),
      `${file}: wrong active page`,
    );
  const email = process.env.PUBLIC_CONTACT_EMAIL || 'laurens.bolle@heartbit.be';
  assert(
    html.includes(`href="mailto:${email}"`),
    `${file}: direct email contact missing`,
  );
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (
      (!value.startsWith('/') && !value.startsWith('#')) ||
      value.startsWith('//')
    )
      continue;
    const url = new URL(value, `https://heartbit.be${pagePath}`);
    let target = join(output, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = join(target, 'index.html');
    assert(
      (await stat(target)).isFile(),
      `${file}: broken local reference ${value}`,
    );
    if (url.hash && pages.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert(
        pages.get(target).includes(`id="${id}"`),
        `${file}: broken anchor ${value}`,
      );
    }
  }
}
const dictionaries = Object.fromEntries(
  await Promise.all(
    ['en', 'nl'].map(async (lang) => [
      lang,
      JSON.parse(await readFile(`src/i18n/${lang}.json`, 'utf8')),
    ]),
  ),
);
const leaves = (value, path = '') =>
  typeof value === 'string'
    ? [[path, value]]
    : Object.entries(value).flatMap(([key, child]) =>
        leaves(child, `${path}.${key}`),
      );
assert.deepEqual(
  leaves(dictionaries.nl)
    .map(([key]) => key)
    .sort(),
  leaves(dictionaries.en)
    .map(([key]) => key)
    .sort(),
  'Translation keys or array lengths differ',
);
const normalize = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replace(/\s+/g, ' ')
    .trim();
for (const lang of ['en', 'nl']) {
  for (const [page, section] of [
    ['', 'home'],
    ['experience', 'experience'],
    ['3d-printing', 'printing'],
    ['404', 'notFound'],
  ]) {
    const html = pages.get(
      join(output, `${lang}/${page ? `${page}/` : ''}index.html`),
    );
    for (const [key, text] of leaves(dictionaries[lang][section])) {
      assert(text.trim(), `${lang}.${section}${key}: empty translation`);
      assert(
        normalize(html).includes(normalize(text)) ||
          html.includes(encodeURIComponent(text)),
        `${lang}.${section}${key}: translation not rendered`,
      );
    }
    for (const alternate of ['en', 'nl']) {
      assert(
        html.includes(`hreflang="${alternate}"`),
        'Missing language alternate',
      );
      assert(
        html.includes(`data-language="${alternate}"`),
        'Missing language picker',
      );
    }
  }
}
assert.equal(
  (await readFile(join(output, 'CNAME'), 'utf8')).trim(),
  'heartbit.be',
);
assert(files.includes(join(output, '.nojekyll')));
console.log(
  `Verified ${htmlFiles.length} generated pages, navigation, contact links, internal references and anchors, metadata, capabilities, and deployment files.`,
);
