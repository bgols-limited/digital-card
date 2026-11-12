# NFC setup and testing

**Key idea:** the NFC tag is only the *delivery mechanism*. It stores one HTTPS address (an NDEF URI
record). The phone that taps it opens that address in its browser. The hosted web page *is* the card.

## 1. Buy the right tag

| Choice | Notes |
|---|---|
| **NTAG215 or NTAG216 PVC card** (recommended) | Business-card sized, prints well, works with Android and iPhone. NTAG213 (144 bytes) is also enough for a URL this short. |
| NFC sticker (NTAG213) | Stick on your phone case or laptop. **Not on a metal surface** unless it is an "on-metal" tag. |
| Avoid | MIFARE Classic 1K (iPhones cannot read it), and pre-locked "smart cards" tied to a vendor's paid platform, unless you accept that vendor's URL. |

## 2. Write the tag

First make sure the site is live and `PROFILE_URL` is final (see `DEPLOYMENT.md`).

**A. From the card itself (Android + Chrome):** open `https://<your-address>/nfc-setup.html` in
**Google Chrome on Android**, switch NFC on, tap **Write to NFC tag**, hold the tag to the back of the phone.
(Web NFC is Chrome-on-Android only. It does not work in Samsung Internet or on iPhone.)

**B. Any phone with the free "NFC Tools" app (wakdev):**
Write → Add a record → **URL / URI** → paste the address → Write → hold the tag.

Record type: **NDEF, Well-Known type "U" (URI)**, prefix `https://` (code 0x04). One record only.

**Lock (optional):** once tested on several phones, NFC Tools → Other → *Lock tag* makes it read-only.
This is permanent. Do not lock a tag that holds the placeholder address.

## 3. Test checklist

| Phone | How it reads | Expected |
|---|---|---|
| Samsung Galaxy / Android | Settings → Connections → **NFC** on; screen unlocked | Notification or browser opens the card |
| iPhone XS / XR and newer | Automatic background reading, screen on | Banner at the top → tap → Safari opens the card |
| iPhone 7 – X | Control Centre → NFC Tag Reader (iOS 14+) | Same as above |

Tap with the **top back** of iPhones and the **middle back** of most Galaxy phones. Thick metal cases block NFC.
Repeat with the QR code using each phone's camera.

## 4. Can my Samsung phone itself act as the NFC card?

Not with a website. A PWA cannot make the phone emit NFC. Options evaluated:

- **Android Host Card Emulation (HCE):** a *native Android app* can emulate an NFC Forum Type 4 tag that
  serves the URL. It needs a custom app (Kotlin, `HostApduService`), the receiving phone must actively read
  (Android reads it; iPhone background reading of an emulated tag is unreliable), and the screen must be on
  and unlocked. Possible, but a separate project and less reliable than a 1-dollar tag.
- **Android Beam:** removed by Google in Android 10. Not available.
- **Samsung Quick Share / Nearby Share:** share the link (or `contact.vcf`) phone-to-phone using the
  **Share Profile** button. This works today and needs no NFC.

Recommendation: carry an NTAG215 card or put an NTAG213 sticker on your phone case.

## 5. Samsung Wallet (optional, not implemented)

Samsung Wallet supports third-party "Generic" cards through its **Add to Samsung Wallet** partner program.
This requires a company partner account on the Samsung Wallet Partners portal, card-template approval and
a server that signs card data, and availability varies by country. It would be a company-level project
for B-GOLS, not something a static website can do. Until then, the PWA's **Add to Home Screen** is the
supported way to keep the card one tap away.

References:
- Samsung: Generic Card — https://developer.samsung.com/wallet/api_new/walletcards/generic.html
- Samsung: Get started with Add to Samsung Wallet — https://developer.samsung.com/wallet/blog/en/2024/04/23/get-started-with-add-to-samsung-wallet
- Apple: Adding support for background tag reading — https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading
