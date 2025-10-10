# Pixel Art Converter

<div align="center">
  <img src="pixel-icon.png" alt="Pixel Art Converter Logo" width="128" height="128">
</div>

## Description

Pixel Art Converter is a small Electron desktop app that converts images into pixel-styled art. It includes multiple pixelation styles, a live preview, and save/download support.

## Features

- Multiple pixelation styles: Basic, Color-Limited, Mosaic, ASCII, Isometric, Cartoon
- Live preview of selected style
- Upload local images from disk (native file dialog)
- Reset image (restore original after applying styles)
- Download result as PNG
- A lightweight build script using `electron-builder`

## Quick Start

Prerequisites: Node.js (v14+), npm

1. Install dependencies

```powershell
npm install
```

2. Run the app in development

```powershell
npm start
```

3. Build distributables (platform-aware)

```powershell
npm run build
```

There is also a `build:all` script (expected to call `build-all.js`) declared in `package.json` but this repository contains `build.js` which builds for the current platform.

## Project layout

- `index.html` — renderer UI and markup
- `styles.css` — app styling
- `main.js` — Electron main process (creates BrowserWindow, menu, IPC handlers)
- `preload.js` — exposes a small `electronAPI` to the renderer (openFile & onMenuAbout)
- `renderer.js` — UI logic and all pixelation algorithms
- `create-icon.js` — Node script that generates `pixel-icon.png` using `canvas`
- `build.js` — platform-aware build script that uses `electron-builder`
- `pixel-icon.png` — generated app icon

## Notable implementation details

- The renderer exposes a custom alert UI (function `showCustomAlert`) instead of relying on native alert boxes.
- Images are opened via a native dialog using IPC (`dialog:openFile`) and loaded into a canvas using `file://` URLs.
- The app stores a copy of the original image pixel data (`originalImageData`) so the "Reset Image" button restores the source before any style was applied.
- Available style functions are implemented in `renderer.js`: `applyBasicPixelation`, `applyColorLimitedPixelation`, `applyMosaicPixelation`, `applyAsciiPixelation`, `applyIsometricPixelation`, `applyCartoonPixelation`.
- The main menu includes a Help → About option that sends a `menu:about` IPC event to the renderer; the renderer listens via `electronAPI.onMenuAbout` and shows the custom alert.

## Scripts (from package.json)

- `npm start` — runs Electron
- `npm run build` — runs `node build.js` (platform-aware electron-builder invocation)
- `npm run build:all` — declared but may expect `build-all.js` (not present)

## Troubleshooting

- If `npm start` fails with Electron version errors, ensure the `electron` devDependency matches a supported Node.js version.
- If `build:all` is required, add or update the missing `build-all.js` or run `node build.js` per-platform.
- When loading local files the renderer uses `file://` URLs. If images fail to load, check console output in the devtools for CORS/path issues.

## Contributing

PRs and issues welcome. Small fixes and documentation updates are appreciated.

---

Made by [Janvii RV]