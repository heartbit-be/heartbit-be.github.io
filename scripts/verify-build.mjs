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
const routes = [
  'index.html',
  'experience/index.html',
  '3d-printing/index.html',
  '404.html',
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
  assert.match(html, /<html[^>]*lang="en"/, `${file}: language missing`);
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${file}: expected one page heading`,
  );
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title missing`);
  assert.match(html, /name="description"/, `${file}: description missing`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert(
    canonical?.startsWith(process.env.SITE_URL || 'https://heartbit.be'),
    `${file}: wrong canonical origin`,
  );
  const noindex = /name="robots" content="noindex, nofollow"/.test(html);
  assert.equal(
    noindex,
    process.env.PUBLIC_SITE_ENV === 'staging',
    `${file}: wrong indexing policy`,
  );
  const navigation = html.match(
    /<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/,
  )?.[1];
  assert(navigation, `${file}: main navigation missing`);
  assert.deepEqual(
    [...navigation.matchAll(/href="([^"]+)"/g)].map(([, href]) => href),
    ['/', '/experience/', '/3d-printing/'],
    `${file}: wrong main navigation`,
  );
  const currentPages = [
    ...navigation.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g),
  ];
  const pagePath =
    `/${routes.find((route) => join(output, route) === file)}`.replace(
      /index\.html$/,
      '',
    );
  assert.equal(
    currentPages.length,
    pagePath === '/404.html' ? 0 : 1,
    `${file}: wrong current navigation item count`,
  );
  if (currentPages.length)
    assert(
      currentPages[0][0].includes(`href="${pagePath}"`),
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
const home = pages.get(join(output, 'index.html'));
for (const capability of [
  'Software engineering',
  'Cloud architecture',
  'AI engineering',
])
  assert(home.includes(capability), `Missing capability: ${capability}`);
assert.equal(
  (await readFile(join(output, 'CNAME'), 'utf8')).trim(),
  'heartbit.be',
);
assert(files.includes(join(output, '.nojekyll')));
console.log(
  `Verified ${htmlFiles.length} generated pages, navigation, contact links, internal references and anchors, metadata, capabilities, and deployment files.`,
);
