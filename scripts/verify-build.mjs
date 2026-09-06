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
for (const path of [
  'index.html',
  'about/index.html',
  'services/index.html',
  'shops/index.html',
  'contact/index.html',
  'work/index.html',
  'work/letter-generator/index.html',
  'work/meeting-controls/index.html',
  '404.html',
]) {
  assert(files.includes(join(output, path)), `Missing route: ${path}`);
}
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
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
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const url = new URL(value, 'https://heartbit.be');
    let target = join(output, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = join(target, 'index.html');
    assert(
      (await stat(target)).isFile(),
      `${file}: broken local reference ${value}`,
    );
  }
}
const services = await readFile(join(output, 'services/index.html'), 'utf8');
for (const service of [
  'Software architecture',
  'Software engineering',
  'AI engineering',
  '3D printing',
])
  assert(services.includes(service));
assert.equal(
  (await readFile(join(output, 'CNAME'), 'utf8')).trim(),
  'heartbit.be',
);
assert(files.includes(join(output, '.nojekyll')));
console.log(
  `Verified ${htmlFiles.length} generated pages, internal references, metadata, services, and deployment files.`,
);
