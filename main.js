const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'pixel-icon.png'), // Add custom icon
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            mainWindow.webContents.send('menu:about');
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'bmp'] },
    ],
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});