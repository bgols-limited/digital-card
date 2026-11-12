/* Service worker: makes the card open instantly and work offline.
   Bump VERSION whenever you change any file so phones fetch the update. */
const PREFIX = "shams-card-";
const VERSION = PREFIX + "v2";
const CORE = [
  "./", "index.html", "card.html", "nfc-setup.html", "email-signature.html", "css/styles.css", "js/config.js", "js/app.js", "contact.vcf",
  "manifest.webmanifest",
  "assets/img/bgols-logo-600.webp", "assets/img/portrait-320.webp", "assets/img/portrait-640.webp", "assets/img/portrait-640.jpg",
  "assets/qr/profile-qr.svg", "assets/qr/profile-qr.png",
  "assets/fonts/manrope-latin-400-normal.woff2", "assets/fonts/manrope-latin-500-normal.woff2",
  "assets/fonts/manrope-latin-600-normal.woff2", "assets/fonts/manrope-latin-700-normal.woff2",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k === "card-v1" || (k.startsWith(PREFIX) && k !== VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // never touch third-party requests

  // Pages and the contact file: network first so updates show up, cache as offline fallback.
  if (req.mode === "navigate" || url.pathname.endsWith(".vcf")) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
    );
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
