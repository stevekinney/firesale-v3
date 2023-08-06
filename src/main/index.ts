import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
} from 'electron';

import { createWindow } from './create-window';
import { setupIpcHandlers, showOpenDialog } from './file-management';

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
        accelerator: 'CmdOrCtrl+O',
        click: (_, browserWindow) => {
          if (!browserWindow) browserWindow = createWindow();
          showOpenDialog(browserWindow);
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.name,
    submenu: [
      { label: `About ${app.name}`, role: 'about' },
      { label: 'Quit', role: 'quit' },
    ],
  });
}

const applicationMenu = Menu.buildFromTemplate(template);
