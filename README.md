# Narrow Path Doctrine Ministries — Android App Tester Registration

A complete, mobile-friendly, static GitHub Pages website. No build tools or backend are required for the public page. Includes a working form interface, three app-interest radio choices, searchable-by-manufacturer dropdowns with representative models, optional extra devices, American English copy, a draft privacy notice, and accessible form feedback.

## Preview the page

Open `index.html` in a browser. All navigation, device selection, FAQ and validation work without hosting. **Preview mode does not send or store an application.** Clicking "Preview submission" shows an explicit no-submission confirmation.

## Before accepting real registrations (required)

1. Sign up or log in to **https://formspree.io/**. Create a new form and configure/verify the email address that should receive tester applications. Formspree may require confirmation of that address. Copy the provided endpoint, which looks like `https://formspree.io/f/abcdefgh`.
2. In `config.js`, replace the empty `formEndpoint` value with the full real URL from your account. Do not insert your email address there; do not put API secrets in the public site.
3. In `config.js`, set `privacyContactEmail` to an email that users may contact about privacy, removal requests and the testing program. This email will be publicly visible in the **privacy notice**. It may be different from the private notification inbox.
4. Review the legal and factual accuracy of `privacy.html` before publishing, including legal basis, retention and service-provider disclosures. It is a draft, not legal advice. Decide how to handle unsubscribes and data deletion.
5. Test a real submission after Formspree is configured, and ensure the email arrives. Review anti-spam settings, quota and notification preferences in your Formspree account.

## GitHub Pages deployment

1. Create a repository (for example `android-app-testers`) under the ministry's GitHub account.
2. Upload **all five files** (`index.html`, `styles.css`, `app.js`, `config.js`, `privacy.html`) to the repository root and commit them.
3. Open repository **Settings → Pages**, choose **Deploy from a branch**, and set the branch to `main` with directory `/(root)`, then save.
4. Your site will be available at a URL similar to `https://YOUR-USERNAME.github.io/android-app-testers/` once GitHub finishes deploying. GitHub Pages sites are public.
5. Test on a phone as well as a computer before linking to it from Google Play or YouTube.

## What data the form sends

- Name and Google Play account email address
- **One selection**: `Scripture based Christian apps only`, `Other types of Android apps only`, or `All types of apps`
- Up to three devices: category, manufacturer, model (or typed model), Android version
- Previous testing experience; willingness to send feedback; optional comments; consent

## Customize

Edit the copy in `index.html` and colors/layout in `styles.css`. The device lists live in `app.js`. Every list includes an `Other / not listed` option with a free-text model field. Edit these lists at any time without changing Formspree.

## Notes

- Completing the form doesn't add users to Google Play testing automatically. You'll still invite eligible testers through Play Console as needed.
- Google Play testing eligibility requirements may depend on the specific test track. Device options are representative, not an authoritative catalogue.
- This site does not use analytics, tracking cookies, or external fonts. Form data goes to Formspree only after the form is connected and an applicant submits it.
- Browser native validation requires JavaScript because device fields are generated when the page loads.