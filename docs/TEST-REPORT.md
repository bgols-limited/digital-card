# Test report

Date: 11 Nov 2026. Environment: cloud sandbox, headless **Chromium** (Playwright) only.
WebKit/Safari, Firefox, Samsung Internet and real phones were **not available** here.

## Tested and passing in the sandbox

| Check | How | Result |
|---|---|---|
| Layout at 320, 360, 412, 768, 1366 px | Screenshots, horizontal-scroll check | No overflow; two-column layout from 900 px |
| Samsung-sized viewport (360×780, 3× DPR, Samsung Internet user-agent) | Chromium emulation | Renders correctly (emulation only, not the real Samsung engine) |
| Card flip (front ↔ QR side) | Click test | Works |
| Share sheet, WeChat sheet open/close | Click test | Works |
| Copy profile link / copy mobile number | Clipboard read-back | Exact text copied; toast shown |
| Clipboard fallback (no Clipboard API) | Code path present (`execCommand` → `prompt`) | Not exercised in a real old browser |
| Share links (WhatsApp, Telegram, LinkedIn, Email, SMS) | Inspected generated URLs | Correct, URL-encoded |
| Contact links (tel, mailto, wa.me, t.me, LinkedIn, website, Maps) | Inspected all hrefs | Correct |
| `contact.vcf` | Parsed with `vobject`; served as `text/vcard` | Valid vCard 3.0: name, org, title, phone, email, 3 URLs, address, note, photo |
| QR codes (PNG navy, PNG black, rendered SVG on page and exports) | Decoded with ZXing | All decode to the profile URL; error correction **H**; 4-module quiet zone |
| PWA installability | Chrome DevTools `getInstallabilityErrors` | No errors; manifest has no errors |
| Offline | Service worker active, page reloaded offline | Page, portrait and styles load offline |
| Dark mode toggle + remembered choice | Click + localStorage check | Works; logo stays on a white plate (never recoloured) |
| Interactive map | Click-to-load | iframe inserted with address query. **Google could not be reached from the sandbox**, so the map tiles themselves were not seen |
| Web NFC page in a non-NFC browser | Load test | Correctly says unsupported and points to NFC Tools |
| Spelling/accuracy of required text | String check against the brief | Name, title, company, email, mobile, LinkedIn, address, website, memberships all match |
| HTML validation (html-validate) | Lint | Only style-rule notices left (lower-case doctype, email-table attributes needed by Outlook) |

## Must be tested on real devices (cannot be done here)

- [ ] Samsung Internet on your Galaxy: layout, Share Profile (native share), Save Contact → Samsung Contacts import, Add to Home Screen, and whether Samsung Internet's own dark mode leaves the page alone.
- [ ] Chrome on Android: same as above, plus `nfc-setup.html` writing a real tag.
- [ ] iPhone Safari: Save Contact opens the contact preview → *Create New Contact*; Share; Add to Home Screen.
- [ ] Google Contacts import of `contact.vcf` (photo, LinkedIn URL and address placement differ slightly between apps).
- [ ] NFC tag: tap with a Galaxy (NFC on) and an iPhone XS or newer.
- [ ] QR: scan the printed size (at least 2 × 2 cm) with several phone cameras.
- [ ] Telegram link `t.me/+8801335134471`: opens the chat only if your Telegram privacy setting allows people to find you by phone number.
- [ ] WhatsApp, LinkedIn, website, call and email buttons on a phone.
- [ ] Google Maps finds "B&T Nehaleeya Tower, Banani" accurately (the link uses the address text, not coordinates).
- [ ] HTTPS certificate and permanent URL, after hosting.
