// Add utility function for creating custom alerts at the beginning of the file
function showCustomAlert(message, title = "Pixel Art Converter") {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // Create alert container
  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  
  // Create title
  const alertTitle = document.createElement('h3');
  alertTitle.textContent = title;
  alertBox.appendChild(alertTitle);
  
  // Create message
  const alertMessage = document.createElement('p');
  alertMessage.textContent = message;
  alertBox.appendChild(alertMessage);
  
  // Create OK button
  const okButton = document.createElement('button');
  okButton.textContent = 'OK';
  okButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(alertBox);
  });
  alertBox.appendChild(okButton);
  
  document.body.appendChild(alertBox);
  
  // Focus the OK button
  okButton.focus();
}

const uploadButton = document.getElementById('uploadButton');
const downloadButton = document.getElementById('downloadButton');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');

let image = new Image();
// Store the original image data to allow reverting to original
let originalImageData = null;

uploadButton.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile();
  if (filePath) {
    // Convert the local file path to a data URL that browsers can display
    // Create a URL using the file protocol for Electron
    image.src = `file://${filePath}`;
    
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      // Store the original image data when a new image is loaded
      originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    image.onerror = (err) => {
      console.error('Error loading image:', err);
      showCustomAlert('There was an error loading the image. Please try again.');
    };
  }
});

// Add clear button event listener to restore the original image
clearButton.addEventListener('click', () => {
  if (originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
  } else {
    showCustomAlert('No image has been loaded yet!');
  }
});

downloadButton.addEventListener('click', () => {
  if (!image.src) {
    showCustomAlert('Please upload an image and apply a style first!', 'No Image');
    return;
  }
  
  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

const startButton = document.getElementById('startButton');
const landingPage = document.getElementById('landingPage');
const appPage = document.getElementById('appPage');

startButton.addEventListener('click', () => {
  landingPage.style.display = 'none';
  appPage.style.display = 'block';
});

// Handle 'About' menu option - fixed to use the exposed API
window.electronAPI.onMenuAbout(() => {
  showCustomAlert('Pixel Art Converter v1.0\nCreated by Pixel Art Enthusiasts');
});

const previewButton = document.getElementById('previewButton');

const styleButtons = document.querySelectorAll('.style-button');
let selectedStyle = null;

styleButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    styleButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the clicked button
    button.classList.add('active');

    // Set the selected style
    selectedStyle = button.getAttribute('data-style');
  });
});

// Debugging: Log the selected style when a button is clicked
styleButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log('Selected style:', button.getAttribute('data-style'));
  });
});

previewButton.addEventListener('click', () => {
  if (!selectedStyle) {
    showCustomAlert('Please select a pixelation style first!');
    return;
  }

  if (!image.src) {
    showCustomAlert('Please upload an image first!');
    return;
  }

  // Make sure we have the original image data
  if (!originalImageData) {
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  // Always start with the original image before applying a new style
  ctx.putImageData(originalImageData, 0, 0);

  try {
    switch (selectedStyle) {
      case 'basic':
        applyBasicPixelation();
        break;
      case 'colorLimited':
        applyColorLimitedPixelation();
        break;
      case 'mosaic':
        applyMosaicPixelation();
        break;
      case 'ascii':
        applyAsciiPixelation();
        break;
      case 'isometric':
        applyIsometricPixelation();
        break;
      case 'cartoon':
        applyCartoonPixelation();
        break;
      default:
        showCustomAlert('Unknown style selected');
    }
  } catch (error) {
    console.error('Error applying style:', error);
    showCustomAlert('There was an error applying the style. Please try again.');
    // Restore original image if there's an error
    ctx.putImageData(originalImageData, 0, 0);
  }
});

// Debugging: Log the selected style when 'Preview' is clicked
previewButton.addEventListener('click', () => {
  console.log('Previewing style:', selectedStyle);
});

function applyBasicPixelation() {
  const pixelSize = 10; // Adjust pixel size as needed
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const red = data[((y * width + x) * 4)];
      const green = data[((y * width + x) * 4) + 1];
      const blue = data[((y * width + x) * 4) + 2];

      for (let n = 0; n < pixelSize; n++) {
        for (let m = 0; m < pixelSize; m++) {
          if (x + m < width && y + n < height) {
            const index = (((y + n) * width + (x + m)) * 4);
            data[index] = red;
            data[index + 1] = green;
            data[index + 2] = blue;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyColorLimitedPixelation() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const palette = [
    [0, 0, 0], // Black
    [255, 255, 255], // White
    [255, 0, 0], // Red
    [0, 255, 0], // Green
    [0, 0, 255], // Blue
  ];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let closestColor = palette[0];
    let minDistance = Infinity;

    for (const color of palette) {
      const distance = Math.sqrt(
        Math.pow(r - color[0], 2) +
        Math.pow(g - color[1], 2) +
        Math.pow(b - color[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    data[i] = closestColor[0];
    data[i + 1] = closestColor[1];
    data[i + 2] = closestColor[2];
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyMosaicPixelation() {
  const pixelSize = 10; // Mosaic block size
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let r = 0, g = 0, b = 0, count = 0;

      for (let n = 0; n < pixelSize; n++) {
        for (let m = 0; m < pixelSize; m++) {
          if (x + m < width && y + n < height) {
            const index = ((y + n) * width + (x + m)) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            count++;
          }
        }
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      for (let n = 0; n < pixelSize; n++) {
        for (let m = 0; m < pixelSize; m++) {
          if (x + m < width && y + n < height) {
            const index = ((y + n) * width + (x + m)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyAsciiPixelation() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
  const asciiCanvas = document.createElement('canvas');
  const asciiCtx = asciiCanvas.getContext('2d');
  asciiCanvas.width = width;
  asciiCanvas.height = height;

  asciiCtx.fillStyle = 'white';
  asciiCtx.fillRect(0, 0, width, height);
  asciiCtx.fillStyle = 'black';
  asciiCtx.font = '10px monospace';

  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const index = (y * width + x) * 4;
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
      asciiCtx.fillText(asciiChars[charIndex], x, y + 10);
    }
  }

  ctx.drawImage(asciiCanvas, 0, 0);
}

function applyIsometricPixelation() {
  const pixelSize = 10; // Isometric block size
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Clear the canvas first
  ctx.clearRect(0, 0, width, height);
  
  // Draw isometric pixels
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Only process pixels that are within bounds
      if (y < height && x < width) {
        const index = (y * width + x) * 4;
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];

        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + pixelSize / 2, y + pixelSize / 2);
        ctx.lineTo(x, y + pixelSize);
        ctx.lineTo(x - pixelSize / 2, y + pixelSize / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

function applyCartoonPixelation() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Posterize effect
    data[i] = Math.floor(r / 64) * 64;
    data[i + 1] = Math.floor(g / 64) * 64;
    data[i + 2] = Math.floor(b / 64) * 64;
  }

  ctx.putImageData(imageData, 0, 0);

  // Add bold edges
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
}