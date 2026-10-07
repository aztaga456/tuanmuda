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

async function processImage() {
  const inputPath =
    "C:\\Users\\X390\\.gemini\\antigravity-ide\\brain\\d1fe8297-aa86-4646-92c7-418a35d54850\\.user_uploaded\\media_1791080782190.jpg";
  const logoPath = "public\\logo-dark.png";
  const outputPath = "public\\hero-laptop-transparent.png";

  console.log("Reading raw input image...");
  const img = await Jimp.read(inputPath);
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  const data = img.bitmap.data;

  // Step 1: Chroma Key with intelligent shadow handling & despill
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      const { h, s, v } = rgbToHsv(r, g, b);
      const maxRB = Math.max(r, b);
      const greenExcess = g - maxRB;

      const isGreenHue = h >= 68 && h <= 170;

      if (isGreenHue && s > 0.22 && greenExcess > 12) {
        // Check if this is a dark contact shadow on the floor (under laptop / polaroid)
        if (y > 780 && v < 0.28 && s < 0.85) {
          // Convert green floor shadow into a neutral semi-transparent black shadow
          data[idx] = 10;
          data[idx + 1] = 10;
          data[idx + 2] = 25;
          // Alpha proportional to shadow darkness
          const shadowFactor = 1 - (v / 0.28);
          data[idx + 3] = Math.max(0, Math.min(255, Math.round(shadowFactor * 160)));
        } else if (greenExcess >= 35 && s > 0.32) {
          // Fully transparent background
          data[idx + 3] = 0;
        } else {
          // Soft feathered transition
          const factor = (greenExcess - 12) / 23; // 0 to 1
          data[idx + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - factor))));
          // Despill green
          data[idx + 1] = Math.round(maxRB);
        }
      } else {
        // Foreground: despill any green reflection on edges
        if (isGreenHue && g > maxRB) {
          data[idx + 1] = Math.round((maxRB + (r + b) / 2) / 2);
        }
      }
    }
  }

  // Step 2: Clean up isolated stray pixels in empty outer areas
  // Outer margin safety check (top 60px, bottom 30px, left 30px, right 30px)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Clear outer margins if any faint noise remains
      if (y < 45 || y > height - 25 || x < 25 || x > width - 25) {
        const idx = (y * width + x) * 4;
        data[idx + 3] = 0;
      }
    }
  }

  // Step 3: Replace "NEXUS SOLUTIONS" with NUSADIGITAL logo on the laptop screen
  console.log("Compositing NUSADIGITAL logo onto the laptop screen...");
  try {
    const logoImg = await Jimp.read(logoPath);
    // Resize logo to fit the navbar: width ~95px, height ~34px
    logoImg.resize({ w: 92, h: 32 });

    // First paint a crisp white patch over the old "NEXUS SOLUTIONS" logo (x: 298 to 395, y: 353 to 387)
    for (let py = 353; py <= 387; py++) {
      for (let px = 296; px <= 396; px++) {
        const pidx = (py * width + px) * 4;
        data[pidx] = 255;
        data[pidx + 1] = 255;
        data[pidx + 2] = 255;
        data[pidx + 3] = 255;
      }
    }

    // Composite the official logo
    img.composite(logoImg, 298, 354);
    console.log("Successfully composited NUSADIGITAL logo on laptop screen!");
  } catch (err) {
    console.warn("Could not composite logo, continuing:", err);
  }

  await img.write(outputPath);
  console.log("Saved refined transparent image to:", outputPath);
}

processImage().catch(console.error);
