// Runs in the head before rendering. Explicit language URLs always win.
(() => {
  const script = document.currentScript;
  const page = script.dataset.page;
  const supported = ['en', 'nl'];
  const storageKey = 'heartbit-language';
  if (script.dataset.automatic === 'true') {
    let saved;
    try {
      saved = localStorage.getItem(storageKey);
    } catch {
      // The picker and browser preference also work when storage is blocked.
    }
    const explicit = location.pathname.split('/')[1];
    const preferred = (navigator.languages || [navigator.language])
      .map((language) => language.toLowerCase().split('-')[0])
      .find((language) => supported.includes(language));
    const language = supported.includes(explicit)
      ? explicit
      : supported.includes(saved)
        ? saved
        : preferred || 'en';
    location.replace(
      `/${language}/${page ? `${page}/` : ''}${location.search}${location.hash}`,
    );
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language]').forEach((link) => {
      // Keep query strings and section anchors when changing languages.
      const target = link.href;
      link.href = target + location.search + location.hash;
      link.addEventListener('click', () => {
        link.href = target + location.search + location.hash;
        try {
          localStorage.setItem(storageKey, link.dataset.language);
        } catch {
          // Normal links still select a language without localStorage.
        }
      });
    });
  });
})();
