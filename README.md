# Uplift — marketing website

Static marketing site for **Uplift: Daily Motivation** (iOS, bundle `com.codewithik.Uplift`) by Hokfam.
Plain HTML, CSS and JavaScript. No build step, no dependencies, no cookies or analytics.

```
index.html        landing page (hero, showcase, onboarding, focus demo, themes, widgets, features, Premium, FAQ)
privacy.html      privacy policy
terms.html        terms of use (Apple Standard EULA + auto-renew wording)
support.html      help and contact
404.html          not-found page (GitHub Pages serves it automatically)
css/style.css     all styles
js/main.js        all animation and interaction (vanilla JS)
assets/           compressed images (WebP/JPG), icons and the Open Graph image
.nojekyll         tells GitHub Pages to serve files as-is
```

## Publish with GitHub Pages

The app already links to `https://uplift-daily-motivation.github.io/uplift/terms.html`,
`/privacy.html` and `/support.html`, so the simplest setup is:

1. Sign in to GitHub as (or create) the account/organisation **uplift-daily-motivation**.
2. Create a public repository named **uplift**.
3. Upload everything in this folder to the root of the repository (include the hidden `.nojekyll` file).
   - Web: *Add file › Upload files*, drag in the folder contents, commit.
   - Or Git:
     ```bash
     cd uplift_site
     git init && git add -A && git commit -m "Uplift website"
     git branch -M main
     git remote add origin https://github.com/uplift-daily-motivation/uplift.git
     git push -u origin main
     ```
4. In the repo: *Settings › Pages › Build and deployment › Source: Deploy from a branch*, branch **main**, folder **/ (root)**, Save.
5. After a minute or two the site is live at `https://uplift-daily-motivation.github.io/uplift/`.

### Using a different account, repo name or custom domain

All internal links are relative, so the site works at any path. Only the absolute URLs used by
search engines and link previews need updating — search and replace
`https://uplift-daily-motivation.github.io/uplift/` in `*.html`, `robots.txt` and `sitemap.xml`.
If you change the address, also update `AppLinks` in the app (`PremiumView.swift`) and the
Privacy Policy / Terms URLs in App Store Connect. For a custom domain, add a `CNAME` file and set it under *Settings › Pages*.

## Editing

- App Store link: `https://apps.apple.com/app/id6749272312` (appears in `index.html` and legal pages).
- Support e-mail: `support@uplift-app.com` (in `privacy.html`, `terms.html`, `support.html`). Make sure this mailbox works before publishing.
- Prices are deliberately not hard-coded; the app shows local prices before purchase.
- Motion respects `prefers-reduced-motion`. Animations only touch `transform` and `opacity`.

## Local preview

```bash
cd uplift_site && python3 -m http.server 8080
# open http://localhost:8080
```
