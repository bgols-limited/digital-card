/*
 * ONE place to change the public address of the card.
 *
 * Set PROFILE_URL to the permanent HTTPS address where this folder is hosted,
 * then run:  node scripts/build.mjs
 * That regenerates the QR codes, the .vcf contact file and the link-preview tags
 * so the NFC tag, QR code and contact file all point to the same address.
 *
 * The value below is a PLACEHOLDER (a GitHub Pages address that does not exist yet).
 * Proposed final address once B-GOLS IT configures the subdomain:
 *   https://card.bgols.com/abdullah/
 */
window.CARD_CONFIG = {
  PROFILE_URL: "https://bgols-limited.github.io/digital-card/"
};
