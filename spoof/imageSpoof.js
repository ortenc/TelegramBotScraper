const sharp = require('sharp');

async function spoofImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(300, 300)
    .grayscale()
    .toFile(outputPath);
}
