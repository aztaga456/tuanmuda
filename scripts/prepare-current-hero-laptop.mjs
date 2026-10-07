import { Jimp } from "jimp";

async function main() {
  const pngInput =
    "C:\\Users\\X390\\.gemini\\antigravity-ide\\brain\\d1fe8297-aa86-4646-92c7-418a35d54850\\.user_uploaded\\media_1791084064181.png";
  const logoInput = "public\\logo-dark-tight.png";
  const pngOutput = "public\\hero-laptop-clean.png";

  console.log("Loading user's new laptop PNG...");
  const img = await Jimp.read(pngInput);
  const width = img.bitmap.width;
  const data = img.bitmap.data;

  // Clear "NEXUS SOLUTIONS" with clean white patch
  for (let py = 383; py <= 431; py++) {
    for (let px = 242; px <= 365; px++) {
      const idx = (py * width + px) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }

  // Composite NUSADIGITAL logo
  const logo = await Jimp.read(logoInput);
  logo.resize({ w: 86, h: 42 });
  img.composite(logo, 248, 385);

  // Crop subject bounding box: minX: 198, maxX: 946, minY: 351, maxY: 895
  const cropX = 190;
  const cropY = 345;
  const cropW = 770;
  const cropH = 560;

  console.log(`Cropping to: x=${cropX}, y=${cropY}, w=${cropW}, h=${cropH}`);
  img.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

  await img.write(pngOutput);
  console.log("Successfully saved cropped and branded PNG to:", pngOutput);
}

main().catch(console.error);
