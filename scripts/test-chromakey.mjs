import { Jimp } from "jimp";
import path from "path";

async function main() {
  const inputPath = "C:\\Users\\X390\\.gemini\\antigravity-ide\\brain\\d1fe8297-aa86-4646-92c7-418a35d54850\\.user_uploaded\\media_1791080782190.jpg";
  const outputPath = "public\\hero-laptop-transparent.png";

  console.log("Loading image:", inputPath);
  const image = await Jimp.read(inputPath);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  console.log(`Image size: ${width}x${height}`);

  // Sample corner color
  const samplePixel = (x, y) => {
    const idx = (y * width + x) * 4;
    return {
      r: image.bitmap.data[idx],
      g: image.bitmap.data[idx + 1],
      b: image.bitmap.data[idx + 2],
      a: image.bitmap.data[idx + 3],
    };
  };

  console.log("Corner 10,10:", samplePixel(10, 10));
  console.log("Top-center 500,20:", samplePixel(Math.floor(width/2), 20));
  console.log("Bottom-left 20, 950:", samplePixel(20, height - 30));
}

main().catch(console.error);
