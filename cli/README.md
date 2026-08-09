# QR Scanner CLI

A command-line tool that decodes QR codes from image files, using the same
pipeline as the web app: `jsqr` first, falling back to `qrcode-reader`.

## Usage

```bash
node cli/index.js <image-path> [more images...] [--json]
```

Or via npm script:

```bash
npm run qrscan -- <image-path>
```

## Examples

```bash
# Single file
node cli/index.js README-images/github-qr.png

# Multiple files
node cli/index.js qr1.png qr2.jpg

# Machine-readable JSON output (best for agents)
node cli/index.js qr1.png --json
```

## Output

- The decoded result is printed to stdout, one per file: `path: result`
- Errors and "not detected" messages go to stderr.
- With `--json`, a structured array is printed to stdout instead:
  `[{"file": "...", "ok": true, "result": "...", "decoder": "jsqr"}]`

## Exit codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 0    | All files decoded successfully                 |
| 1    | At least one file failed or had no QR code     |
| 2    | No image paths were provided (usage error)     |

## Supported formats

PNG, JPEG, BMP, GIF, TIFF (anything `jimp` can read).
