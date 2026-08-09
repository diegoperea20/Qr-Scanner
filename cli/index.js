#!/usr/bin/env node
const Jimp = require("jimp");
const jsQR = require("jsqr");
const QrCode = require("qrcode-reader");

function decodeWithJsQR(imageData) {
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code && code.data ? code.data : null;
  } catch (err) {
    return null;
  }
}

function decodeWithQrCodeReader(imageData) {
  return new Promise((resolve) => {
    const qr = new QrCode();
    qr.callback = (err, result) => {
      if (err || !result || !result.result) {
        resolve(null);
        return;
      }
      resolve(result.result);
    };
    qr.decode(imageData);
  });
}

async function decodeFile(filePath) {
  const image = await Jimp.read(filePath);
  const imageData = {
    data: new Uint8ClampedArray(image.bitmap.data),
    width: image.bitmap.width,
    height: image.bitmap.height,
  };

  let result = decodeWithJsQR(imageData);
  let decoder = "jsqr";

  if (!result) {
    result = await decodeWithQrCodeReader(imageData);
    decoder = "qrcode-reader";
  }

  return { file: filePath, result, decoder };
}

function printUsage() {
  console.error(
    "Usage: node cli/index.js <image-path> [more images...] [--json]"
  );
  console.error("Scans QR codes in the given image files and prints the result.");
  console.error("Options:");
  console.error("  --json   Output structured JSON instead of plain text.");
}

async function main(argv) {
  const files = argv.filter((arg) => !arg.startsWith("-"));
  const json = argv.includes("--json");

  if (files.length === 0) {
    printUsage();
    process.exit(2);
  }

  const outputs = [];
  let allOk = true;

  for (const file of files) {
    try {
      const { result, decoder } = await decodeFile(file);
      if (result) {
        outputs.push({ file, ok: true, result, decoder });
        if (!json) {
          console.log(`${file}: ${result}`);
        }
      } else {
        allOk = false;
        outputs.push({ file, ok: false, error: "QR code not detected in image" });
        if (!json) {
          console.error(`${file}: QR code not detected`);
        }
      }
    } catch (err) {
      allOk = false;
      outputs.push({ file, ok: false, error: err.message });
      if (!json) {
        console.error(`${file}: ${err.message}`);
      }
    }
  }

  if (json) {
    console.log(JSON.stringify(outputs, null, 2));
  }

  process.exit(allOk ? 0 : 1);
}

main(process.argv.slice(2));
