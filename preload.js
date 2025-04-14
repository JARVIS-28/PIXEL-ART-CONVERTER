const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // Add new exposed function to handle menu:about event
  onMenuAbout: (callback) => ipcRenderer.on('menu:about', callback),
});