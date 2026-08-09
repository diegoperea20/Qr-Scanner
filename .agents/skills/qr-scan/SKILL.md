---
name: qr-scan
description: Decode/scan QR codes from image files using this project's CLI (cli/index.js). Use when the user wants to read a QR code from an image, extract its encoded URL or text, verify QR content, or when files like .png/.jpg QR codes need decoding. Trigger keywords: QR, qr code, decode, scan QR, read QR, codigo QR, escanear, desencriptar.
---

# QR Scan CLI

This project ships a small command-line tool that decodes QR codes from image
files. It uses the exact same pipeline as the web app: **jsQR first, then
`qrcode-reader` as fallback**.

## How to run

From the project root:

```bash
node cli/index.js <image-path> [more images...] [--json]
```

Or via the npm script:

```bash
npm run qrscan -- <image-path>
```

## Behavior

- The decoded result is printed to stdout: `path: result`
- Errors / "not detected" messages go to stderr.
- **Exit code 0** = all files decoded; **1** = a file failed or had no QR;
  **2** = no image paths given.
- Supported formats: PNG, JPEG, BMP, GIF, TIFF.

## Machine-readable output

Use `--json` when the result needs to be parsed programmatically (recommended
for agent workflows):

```bash
node cli/index.js README-images/github-qr.png --json
```

Produces:

```json
[
  {
    "file": "README-images/github-qr.png",
    "ok": true,
    "result": "https://github.com/...",
    "decoder": "jsqr"
  }
]
```

Each entry has `file`, `ok`, and either `result` + `decoder` (on success) or
`error` (on failure).

## Examples

```bash
# Single image, plain text
node cli/index.js README-images/github-qr.png

# Multiple images
node cli/index.js qr1.png qr2.jpg

# JSON output for automation
node cli/index.js qr1.png --json
```

## Troubleshooting

- **Image path not found / cannot be read**: confirm the path exists and is
  relative to the project root (or absolute).
- **"QR code not detected"**: the image has no readable QR (or it is too
  blurry/small). Try a higher-resolution screenshot.
- **`Cannot find module 'jimp'`**: run `npm install` first.
