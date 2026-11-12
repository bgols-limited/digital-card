# Abdullah Al Shams · Digital Business Card (NFC + QR + PWA)

**TAP. CONNECT. SAVE. SHARE.**
Air Freight Analyst | B-GOLS Limited

A lightweight, installable web app (PWA) that works as a digital business card. One permanent
HTTPS address is shared four ways: an **NFC tag**, a **QR code**, a **link**, and the phone's
**native share sheet**. Visitors can call, email, message, open LinkedIn, get directions and
**save the contact (.vcf)**. No app, login, tracking or data collection.

> **Status:** the code is complete and tested in a headless browser. It is **not live yet**.
> `js/config.js` holds a **placeholder** address (`https://bgols-limited.github.io/digital-card/`).
> Host the folder, put the real address in `js/config.js`, run `node scripts/build.mjs`, then write the NFC tag.

---

## What is in this folder

| Path | What it is |
|---|---|
| `index.html` | Main card: portrait card (front = identity, flip side = QR), full profile, Dhaka, Chattogram and Phnom Penh offices with directions, share sheet. Mobile-first, two columns on desktop. |
| `card.html` | Landscape business card (3.5 × 2 in), front and back, printable. |
| `nfc-setup.html` | Owner tool: shows the exact URL, writes/test-reads an NFC tag from Chrome on Android (Web NFC). |
| `email-signature.html` | Copy-paste email signature (Gmail / Outlook). |
| `contact.vcf` | vCard 3.0 contact file with photo (generated). |
| `js/config.js` | **The one setting:** `PROFILE_URL`. |
| `js/app.js` | Share, copy, flip, theme, map, install, offline. Plain JavaScript. |
| `css/styles.css` | All styling. Brand colours sampled from the logo: navy `#182954`, orange `#F47820`. |
| `manifest.webmanifest`, `sw.js` | PWA install + offline support. |
| `assets/qr/` | QR codes: `profile-qr.png` (2048 px), `profile-qr.svg`, plus black versions (generated). |
| `assets/exports/` | PNG exports: portrait card front/back, landscape front/back (2100×1200), link-preview `og-image.png`, email signature. |
| `assets/img/` | Portrait and logo, cropped/resized only (no retouching, no recolouring). |
| `source-assets/` | Your original, untouched portrait and logo files. |
| `scripts/build.mjs` | Regenerates QR codes, `contact.vcf` and link-preview tags from `PROFILE_URL`. |
| `scripts/export-images.cjs` | Re-renders the PNG exports (needs Playwright). |
| `docs/NFC-SETUP.md` | NFC tag buying, writing, locking, testing; phone-as-NFC and Samsung Wallet notes. |
| `docs/DEPLOYMENT.md` | Hosting step by step (GitHub Pages, Netlify/Cloudflare, `card.bgols.com`). |
| `docs/TEST-REPORT.md` | What was tested here and what must be tested on real phones. |

## Change the address (do this before printing or writing any tag)

1. Edit `js/config.js` → `PROFILE_URL: "https://your-final-address/"` (must be `https://`, keep the trailing `/`).
2. Run:
   ```bash
   npm install
   node scripts/build.mjs
   ```
   This rewrites `assets/qr/*`, `contact.vcf` and the link-preview tags in `index.html`.
3. In `sw.js`, bump `VERSION` (e.g. `card-v2`) so installed copies update.
4. Optional: re-render PNG exports (`python3 -m http.server 8765` in this folder, then `node scripts/export-images.cjs`).
5. Upload/push the folder again.

## Edit contact details

The text lives directly in `index.html`, `card.html`, `email-signature.html` and in the vCard section of
`scripts/build.mjs`. Search for the old value (e.g. the phone number) across the folder, change every
match, then run `node scripts/build.mjs`.

## Preview locally

```bash
python3 -m http.server 8080      # or: npm run serve
# open http://localhost:8080
```

## Privacy and security

- Static files only: no server code, database, admin panel, login, cookies, analytics or credentials.
- The Google map loads **only** when a visitor taps "Show interactive map".
- Fonts, icons and images are self-hosted; the page makes no third-party requests on load.
- HTTPS is provided by the host (GitHub Pages / Netlify / Cloudflare all issue certificates automatically).

## Credits and licences

- Typeface: Manrope (SIL Open Font License, `assets/fonts/OFL-LICENSE.txt`).
- WhatsApp, Telegram, WeChat, LinkedIn marks: Simple Icons (CC0); trademarks of their owners.
- QR generation: `qrcode` npm package (MIT).
- Portrait and B-GOLS logo: supplied by the owner, used unaltered.
