import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
} from 'electron';

import { createWindow } from './create-window';
import { setupIpcHandlers } from './file-management';

setupIpcHandlers();

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(applicationMenu);
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

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        click: () => {
          console.log('Open File');
        },
      },
    ],
  },
];

const applicationMenu = Menu.buildFromTemplate(template);
