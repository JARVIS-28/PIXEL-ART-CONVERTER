// Create a simple pixel art icon for the app
const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 64x64 canvas (good size for an icon)
const canvas = createCanvas(64, 64);
const ctx = canvas.getContext('2d');

// Fill the background
ctx.fillStyle = '#1e1e2f'; // Dark navy background from your CSS
ctx.fillRect(0, 0, 64, 64);

// Draw a pixel art space invader character
// Define the pixel pattern (1 = filled pixel, 0 = empty)
const pixelPattern = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]
];

// Draw the pixel pattern
const pixelSize = 4; // Size of each pixel
const offsetX = (64 - pixelPattern[0].length * pixelSize) / 2;
const offsetY = (64 - pixelPattern.length * pixelSize) / 2;

// Set color to match the bright yellow from your CSS
ctx.fillStyle = '#ffcc00';

// Draw each pixel
for (let y = 0; y < pixelPattern.length; y++) {
  for (let x = 0; x < pixelPattern[y].length; x++) {
    if (pixelPattern[y][x] === 1) {
      ctx.fillRect(
        offsetX + x * pixelSize,
        offsetY + y * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }
}

// Save the image to a PNG file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('pixel-icon.png', buffer);

console.log('Pixel art icon created: pixel-icon.png');