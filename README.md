# For You, Sai ♡

A pink floral birthday microsite built with Next.js, React, TypeScript, and Framer Motion. The bouquet is a photorealistic transparent WebP with CSS animation.

## Run locally

1. Install Node.js 20 or newer.
2. Open this folder in VS Code / terminal.
3. Run `npm install`.
4. Run `npm run dev` and open http://localhost:3000.

## Birthday gate

The date check is in `app/page.tsx` and currently accepts **November 16, 2004** (`2004-11-16`). This is a fun front-end reveal, not secure authentication: the date is visible in the shipped client-side source.

## Personalize

- Replace `public/images/sai-main.jpg` and `memory-01.jpg` ... `memory-09.jpg` to change the photos (keep them under ~1400px on the long edge, ~150 KB each).
- Edit the `memories` array in `app/page.tsx` to change captions.
- Edit the `letterParagraphs` array in `app/page.tsx` to change the letter (one string per paragraph; the "Hi, Sai!" greeting is the heading above it). The supplied message is included verbatim.
- The realistic transparent rose bouquet is `public/images/rose-bouquet.webp`. Replace it with another transparent WebP/PNG to change the bouquet.
- Theme and layout are in `app/globals.css`.

## Push to GitHub

Use a **private** repository: the photos and the letter text live in it.

Create an empty repository on GitHub, then from this project folder run:

```bash
git init
git add .
git commit -m "Create Sai birthday website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy on Vercel

1. Sign in to Vercel with GitHub.
2. Choose **Add New → Project** and import this repository.
3. Keep the detected Next.js framework and default build settings.
4. Click **Deploy**. Vercel will redeploy when you push future GitHub commits.

No database or environment variables are required.


## Latest updates
- Images: removed the unused 2 MB bouquet PNG (the WebP is used), resized the photos, re-enabled Next image optimization, and converted the piano to MP3 (about 5.2 MB down to about 1.9 MB of assets).
- Letter: split into paragraphs, duplicate greeting removed, larger handwriting text, layout no longer jumps while typing, tap the letter to skip the typing, and the wrapper height now follows the letter's real height.
- Lightbox: Escape to close, arrow keys / swipe / on-screen arrows to browse, scroll lock, focus returns to the photo you opened.
- The gate unlock is remembered for the browser tab (refresh doesn't ask again).
- Fonts now load through `next/font` (needs internet during `npm run build`, which Vercel has).
- Readability: bigger caption/label text and darker muted colors; focus outlines added.
- SEO/sharing: `noindex`, link-preview tags (remove `openGraph.images` in `app/layout.tsx` to keep the photo a surprise), and a flower favicon.
- `npm run lint` works (ESLint config added).
- Realism pass (CSS only, at the end of `app/globals.css`): paper grain, tilted envelope with a patterned liner and contact shadow, pressed wax seal, tri-fold creases on the letter, washi tape and softer layered shadows on the photos, and some out-of-focus petals.
