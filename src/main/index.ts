import { app, BrowserWindow } from 'electron';

import { createWindow } from './create-window';
import { setupIpcHandlers } from './file-management';

setupIpcHandlers();

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
