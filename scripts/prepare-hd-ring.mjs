import { Jimp } from "jimp";

async function main() {
  const p = "C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/hd_glowing_ring_1791087208394.jpg";
  const img = await Jimp.read(p);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxVal = Math.max(r, g, b);

    // If near solid black background
    if (maxVal < 10) {
      data[i + 3] = 0;
    } else {
      // Smooth alpha ramp
      const alpha = Math.min(255, Math.max(0, Math.round(((maxVal - 10) / (255 - 10)) * 255 * 1.15)));
      data[i + 3] = alpha;
    }
  }

  await img.write("public/glowing-ring-hd.png");
  console.log("public/glowing-ring-hd.png created successfully!");
}

main().catch(console.error);
