import { Jimp } from "jimp";

async function processToTransparent(inputPath, outputPath, isPhoto = false) {
  const img = await Jimp.read(inputPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const data = img.bitmap.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxVal = Math.max(r, g, b);

    // If it's near black background
    if (maxVal < 15) {
      data[i + 3] = 0;
    } else if (maxVal < 45) {
      data[i + 3] = Math.round(((maxVal - 15) / 30) * 255);
    }
  }

  // If photo has text "FUJIFILM", we can patch it to "NUSADIGITAL" or clean it
  if (isPhoto) {
    // Let's inspect where "FUJIFILM" is: it's on bottom right of the white frame
    // We can clear it or let it blend
  }

  await img.write(outputPath);
  console.log(`Saved transparent 3D asset to ${outputPath}`);
}

async function main() {
  await processToTransparent(
    "C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/icon_3d_video_1791084370299.jpg",
    "public/element-3d-video.png"
  );
  await processToTransparent(
    "C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/icon_3d_photo_1791084396144.jpg",
    "public/element-3d-photo.png",
    true
  );
}

main().catch(console.error);
