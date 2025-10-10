const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const png2icons = require('png2icons');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function createPngSizes(srcPath, outDir, sizes = [16,32,48,64,128,256,512]) {
  const img = await loadImage(srcPath);
  await ensureDir(outDir);

  const tasks = sizes.map(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    // draw the source image scaled to the square
    ctx.drawImage(img, 0, 0, size, size);
    const out = path.join(outDir, `icon_${size}x${size}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(out, buffer);
    return out;
  });

  return tasks;
}

function createIcoSync(fromPngPath, outIcoPath) {
  const pngBuffer = fs.readFileSync(fromPngPath);
  // use png2icons to create ICO (returns Buffer or null)
  const icoBuf = png2icons.createICO(pngBuffer, png2icons.BICUBIC, false, png2icons.PNG_GOOD);
  if (!icoBuf) throw new Error('Failed to create ICO');
  fs.writeFileSync(outIcoPath, icoBuf);
}

function createIcnsSync(pngPath, outIcnsPath) {
  const pngBuffer = fs.readFileSync(pngPath);
  const icnsBuf = png2icons.createICNS(pngBuffer, png2icons.BICUBIC, false, png2icons.PNG_GOOD);
  if (!icnsBuf) throw new Error('Failed to create ICNS');
  fs.writeFileSync(outIcnsPath, icnsBuf);
}

async function main() {
  const src = path.resolve(__dirname, 'pixel-icon.png');
  const buildDir = path.resolve(__dirname, 'build');
  await ensureDir(buildDir);

  if (!fs.existsSync(src)) {
    console.error('Source icon not found:', src);
    process.exit(1);
  }

  console.log('Creating PNG icon sizes...');
  await createPngSizes(src, buildDir, [16,32,48,64,128,256,512]);

  const icoOut = path.join(buildDir, 'icon.ico');
  console.log('Creating ICO:', icoOut);
  try {
    createIcoSync(src, icoOut);
  } catch (err) {
    console.warn('Warning: ICO generation failed using png2icons. Error:', err && err.message);
  }

  const icnsOut = path.join(buildDir, 'icon.icns');
  console.log('Creating ICNS:', icnsOut);
  try {
    createIcnsSync(src, icnsOut);
  } catch (err) {
    console.warn('Warning: could not create ICNS automatically. You may need to run iconutil on macOS. Error:', err && err.message);
  }

  const pngOut = path.join(buildDir, 'icon.png');
  fs.copyFileSync(src, pngOut);

  console.log('Icons generated in', buildDir);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
