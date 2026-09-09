import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('src/i18n/browser.js', 'utf8');
function visit({
  languages = ['en-US'],
  saved,
  automatic = true,
  page = '',
  pathname = '/',
  blocked = false,
} = {}) {
  let destination;
  let ready;
  const links = ['en', 'nl'].map((language) => ({
    href: `/${language}/${page ? `${page}/` : ''}`,
    dataset: { language },
    addEventListener(_, handler) {
      this.click = handler;
    },
  }));
  runInNewContext(source, {
    document: {
      currentScript: { dataset: { page, automatic: String(automatic) } },
      addEventListener(_, callback) {
        ready = callback;
      },
      querySelectorAll() {
        return links;
      },
    },
    navigator: { languages, language: languages[0] },
    localStorage: {
      getItem() {
        if (blocked) throw new Error('Storage blocked');
        return saved;
      },
      setItem(_, value) {
        if (blocked) throw new Error('Storage blocked');
        saved = value;
      },
    },
    location: {
      pathname,
      search: '?ref=card',
      hash: '#contact',
      replace(url) {
        destination = url;
      },
    },
  });
  ready();
  return { destination, links, saved: () => saved };
}
for (const [languages, expected] of [
  [['nl-BE', 'en'], 'nl'],
  [['nl-NL'], 'nl'],
  [['en-GB', 'nl'], 'en'],
  [['fr-BE', 'nl-BE'], 'nl'],
  [['de', 'fr'], 'en'],
  [[], 'en'],
])
  assert.equal(
    visit({ languages }).destination,
    `/${expected}/?ref=card#contact`,
  );
assert.equal(
  visit({ languages: ['nl'], saved: 'en', page: 'experience' }).destination,
  '/en/experience/?ref=card#contact',
);
assert.equal(
  visit({ languages: ['nl'], saved: 'invalid' }).destination,
  '/nl/?ref=card#contact',
);
assert.equal(
  visit({ languages: ['nl'], blocked: true }).destination,
  '/nl/?ref=card#contact',
);
assert.equal(
  visit({ automatic: false, languages: ['nl'] }).destination,
  undefined,
);
assert.equal(
  visit({ pathname: '/nl/missing', page: '404', saved: 'en' }).destination,
  '/nl/404/?ref=card#contact',
);
const manual = visit({ automatic: false, page: 'experience' });
assert.equal(manual.links[1].href, '/nl/experience/?ref=card#contact');
manual.links[1].click();
assert.equal(manual.saved(), 'nl');
assert.doesNotThrow(() => visit({ blocked: true }).links[1].click());
console.log(
  'Verified browser language priorities, regional variants, manual preference, deep links, 404s, and blocked storage.',
);
