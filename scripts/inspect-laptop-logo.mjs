import { Jimp } from "jimp";

async function run() {
  const img = await Jimp.read("C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/.user_uploaded/media_1791084064181.png");
  const w = img.bitmap.width;

  for (let x = 230; x <= 265; x++) {
    let darkCount = 0;
    for (let y = 383; y <= 430; y++) {
      const idx = (y * w + x) * 4;
      if (img.bitmap.data[idx] < 230) darkCount++;
    }
    if (darkCount > 0) console.log(`x=${x}: darkCount=${darkCount}`);
  }
}

run().catch(console.error);
