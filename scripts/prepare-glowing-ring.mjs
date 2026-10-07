import { Jimp } from "jimp";

async function main() {
  const p = "C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/.user_uploaded/media_1791087079007.png";
  const img = await Jimp.read(p);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  // Center coordinate
  const cx = w / 2;
  const cy = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const maxVal = Math.max(r, g, b);

      // Distance from center
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      // In the center hole (dist < 60) or outside (dist > 135)
      if (maxVal < 14) {
        data[idx + 3] = 0;
      } else {
        // Boost vibrancy and smooth alpha
        const alpha = Math.min(255, Math.max(0, Math.round(((maxVal - 14) / (255 - 14)) * 255 * 1.2)));
        data[idx + 3] = alpha;
      }
    }
  }

  await img.write("public/glowing-ring.png");
  console.log("public/glowing-ring.png generated successfully!");
}

main().catch(console.error);
