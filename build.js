const builder = require("electron-builder");
const Platform = builder.Platform;

// Detect current OS
let currentPlatform = process.platform; // 'win32', 'darwin', 'linux'
let targets;

switch (currentPlatform) {
  case "win32":
    // Windows build
    targets = Platform.WINDOWS.createTarget();
    console.log("Building for Windows only...");
    break;
  case "darwin":
    // macOS build
    targets = Platform.MAC.createTarget();
    console.log("Building for macOS only...");
    break;
  case "linux":
    // Linux build
    targets = Platform.LINUX.createTarget();
    console.log("Building for Linux only...");
    break;
  default:
    console.error("Unsupported platform:", currentPlatform);
    process.exit(1);
}

// Build with electron-builder
builder
  .build({
    targets,
    config: {
      appId: "com.yourname.pixelart",
      productName: "PixelArt",
      directories: {
        output: "dist"
      },
      files: ["**/*"],
      win: {
        target: "nsis"
      },
      mac: {
        target: "dmg",
        category: "public.app-category.graphics-design"
      },
      linux: {
        target: ["AppImage", "deb"]
      },
      publish: null
    }
  })
  .then(() => console.log("Build successful!"))
  .catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });
