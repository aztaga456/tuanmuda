import { Jimp } from "jimp";

async function main() {
  const pngInput =
    "C:\\Users\\X390\\.gemini\\antigravity-ide\\brain\\d1fe8297-aa86-4646-92c7-418a35d54850\\.user_uploaded\\media_1791082794588.png";
  const logoInput = "public\\logo-dark.png";
  const pngOutput = "public\\hero-laptop-ref.png";

  console.log("Loading reference PNG...");
  const img = await Jimp.read(pngInput);
  const width = img.bitmap.width;
  const data = img.bitmap.data;

  // Clear "NEXUS SOLUTIONS" with clean white patch
  for (let py = 362; py <= 398; py++) {
    for (let px = 378; px <= 462; px++) {
      const idx = (py * width + px) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  // Composite NUSADIGITAL logo
  const logo = await Jimp.read(logoInput);
  logo.resize({ w: 82, h: 28 });
  img.composite(logo, 380, 366);

  // Crop bounding box: minX: 181, maxX: 970, minY: 338, maxY: 799
  // We add 15px padding
  const cropX = Math.max(0, 181 - 15);
  const cropY = Math.max(0, 338 - 15);
  const cropW = Math.min(width - cropX, 970 - 181 + 30);
  const cropH = Math.min(img.bitmap.height - cropY, 799 - 338 + 30);

  console.log(`Cropping to: x=${cropX}, y=${cropY}, w=${cropW}, h=${cropH}`);
  img.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

  await img.write(pngOutput);
  console.log("Successfully saved cropped and branded PNG to:", pngOutput);
}

main().catch(console.error);
