# AGENTS.md

## Project Overview

QR Scanner is a Next.js web application that scans QR codes using different methods:

- **Camera**: Live scanning via `react-webcam` with jsQR, detecting codes in real time.
- **Image upload**: Select or drag-and-drop an image file to detect QR codes.
- **Clipboard**: Paste a QR code image (circular `📋` button or `Ctrl+V`) to run the same analysis flow.

## Tech Stack

- Next.js 14 (App Router) + React 18
- `react-webcam` — camera capture
- `jsqr` — primary QR decoding (works on raw image data)
- `qrcode-reader` — fallback decoder when jsQR fails
- All logic lives in `src/app/page.js` (client component) with styles in `src/app/globals.css`

## Structure

- `src/app/page.js` — main page component with all scanner logic (camera, upload, clipboard)
- `src/app/globals.css` — global styles (component classes, responsive media queries, animations)
- `src/app/page.module.css` — empty/unused
- `src/app/layout.js` — root layout with metadata
- `src/app/icon.ico` — favicon

## Key Flow

`processFile(file)` is the shared analysis pipeline used by all input methods:

1. Reads the image as a data URL.
2. Draws it to a canvas and extracts `ImageData`.
3. Tries `jsQR` first; if it fails, falls back to `qrcode-reader`.
4. On success: shows a success message (auto-hides after 3s), stores the result, and opens the URL in a new tab.

## Commands

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — lint (currently broken: `.eslintrc.json` extends the invalid `next/babel` config; use `npm run build` to type-check instead)

## Notes

- Clipboard API (`navigator.clipboard.read()`) requires HTTPS or localhost and the `clipboard-read` permission. The `Ctrl+V` paste listener always works.
- The lint configuration in `.eslintrc.json` (`extends: ["next/babel", ...]`) is invalid and should be fixed (e.g. use `next/core-web-vitals` only) if linting is needed.
