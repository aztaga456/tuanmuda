import { Jimp } from "jimp";

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, v };
}

async function removeGreenScreen() {
  const inputPath =
    "C:\\Users\\X390\\.gemini\\antigravity-ide\\brain\\d1fe8297-aa86-4646-92c7-418a35d54850\\.user_uploaded\\media_1791080782190.jpg";
  const outputPath = "public\\hero-laptop-transparent.png";

  console.log("Loading image from:", inputPath);
  const image = await Jimp.read(inputPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const data = image.bitmap.data;

  let transparentPixels = 0;
  let semiTransparentPixels = 0;
  let solidPixels = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      const { h, s, v } = rgbToHsv(r, g, b);
      const maxRB = Math.max(r, b);
      const greenExcess = g - maxRB;

      // Check if green screen background
      // Green hue range is roughly 75 to 165 degrees
      const isGreenHue = h >= 72 && h <= 165;

      if (isGreenHue && s > 0.25 && greenExcess > 15) {
        if (greenExcess >= 40 && s > 0.35) {
          // Fully transparent
          data[idx + 3] = 0;
          transparentPixels++;
        } else {
          // Smooth edge feathering
          const factor = (greenExcess - 15) / 25; // 0 to 1
          const alpha = Math.max(0, Math.min(255, Math.round(255 * (1 - factor))));
          data[idx + 3] = alpha;

          // Despill green from the semi-transparent edge
          data[idx + 1] = Math.round(maxRB);
          semiTransparentPixels++;
        }
      } else {
        // Foreground pixel
        // Despill slight green spill on edges
        if (g > maxRB && isGreenHue) {
          data[idx + 1] = Math.round((maxRB + (r + b) / 2) / 2);
        }
        solidPixels++;
      }
    }
  }

  console.log(`Processing complete:`);
  console.log(`- Transparent: ${transparentPixels}`);
  console.log(`- Semi-transparent: ${semiTransparentPixels}`);
  console.log(`- Solid: ${solidPixels}`);

  await image.write(outputPath);
  console.log("Saved transparent PNG to:", outputPath);
}

removeGreenScreen().catch(console.error);
