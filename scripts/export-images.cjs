// Renders PNG exports of the cards into assets/exports/ using Playwright.
// Usage: serve this folder on http://localhost:8765 (e.g. `python3 -m http.server 8765`),
// then run: node scripts/export-images.cjs
const { chromium } = require("playwright");
const path = require("path");
const BASE = process.env.BASE || "http://localhost:8765/";
const OUT = path.join(__dirname, "..", "assets", "exports");

(async () => {
  const browser = await chromium.launch();

  // Landscape card, front and back: 1050 x 600 CSS px at 2x = 2100 x 1200 px (600 dpi at 3.5 x 2 in)
  const land = await browser.newPage({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 2 });
  await land.goto(BASE + "card.html", { waitUntil: "networkidle" });
  await land.addStyleTag({ content: ".face{box-shadow:none!important;border-radius:0!important}" });
  await land.locator("#front .face").screenshot({ path: path.join(OUT, "landscape-card-front.png") });
  await land.locator("#back .face").screenshot({ path: path.join(OUT, "landscape-card-back.png") });

  // Link-preview image for WhatsApp / LinkedIn / email: exactly 1200 x 630
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.goto(BASE + "card.html", { waitUntil: "networkidle" });
  await og.addStyleTag({ content: "body{padding:0!important;height:630px;display:grid;place-items:center;overflow:hidden}.bar,.label,.note,#back{display:none!important}.wrap{width:1040px}" });
  await og.screenshot({ path: path.join(OUT, "og-image.png") });

  // Portrait digital card, front and QR back, at 3x (phone-sharp)
  const ph = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3 });
  await ph.goto(BASE, { waitUntil: "networkidle" });
  await ph.waitForTimeout(2000);
  await ph.locator(".card-front").screenshot({ path: path.join(OUT, "portrait-card-front.png") });
  await ph.click(".flip-toggle");
  await ph.waitForTimeout(1000);
  await ph.addStyleTag({ content: ".flip-inner{transition:none!important}" });
  await ph.locator(".card-back").screenshot({ path: path.join(OUT, "portrait-card-back.png") });

  // Email signature preview
  const sig = await browser.newPage({ viewport: { width: 700, height: 600 }, deviceScaleFactor: 2 });
  await sig.goto(BASE + "email-signature.html", { waitUntil: "networkidle" });
  await sig.locator("#sig table").screenshot({ path: path.join(OUT, "email-signature.png") });

  await browser.close();
  console.log("Exports written to", OUT);
})();
