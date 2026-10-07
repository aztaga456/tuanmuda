import sharp from "sharp";

const BASE_DIR = "C:/Users/X390/.gemini/antigravity-ide/brain/d1fe8297-aa86-4646-92c7-418a35d54850/.user_uploaded/";

async function main() {
  console.log("1. Processing new brand logo...");
  await sharp(BASE_DIR + "media_1791084689896.png")
    .trim()
    .toFile("public/logo-white.png");
  await sharp(BASE_DIR + "media_1791084689896.png")
    .trim()
    .toFile("public/logo-white-new.png");
  console.log("Logo saved to public/logo-white.png & logo-white-new.png");

  console.log("2. Processing original laptop image (NO logo added, untouched 'apa adanya')...");
  // Bounding box of subject in media_1791084064181.png: minX: 198, maxX: 946, minY: 351, maxY: 895
  // Crop tightly without modifying any pixels on the laptop screen
  await sharp(BASE_DIR + "media_1791084064181.png")
    .extract({
      left: 190,
      top: 345,
      width: 770,
      height: 560,
    })
    .toFile("public/hero-laptop-original.png");
  console.log("Original laptop image saved to public/hero-laptop-original.png");

  console.log("3. Processing 3D reference icons...");
  await sharp(BASE_DIR + "media_1791085021038.png")
    .trim()
    .toFile("public/icon-3d-handshake.png");
  await sharp(BASE_DIR + "media_1791085021054.png")
    .trim()
    .toFile("public/icon-3d-videocall.png");
  await sharp(BASE_DIR + "media_1791085021087.png")
    .trim()
    .toFile("public/icon-3d-location.png");
  console.log("All 3D reference icons trimmed and saved to public/");
}

main().catch(console.error);
