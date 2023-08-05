import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  type WebContents,
} from 'electron';
import { readFile } from 'node:fs/promises';
import { join } from 'path';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });
};

app.on('ready', createWindow);

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

ipcMain.handle('open-file', (event) => {
  return showOpenDialog(event.sender);
});

const showOpenDialog = async (webContents: WebContents) => {
  const browserWindow = BrowserWindow.fromWebContents(webContents);

  if (!browserWindow) return;

  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt'] },
    ],
    message: 'Select a Markdown File',
    buttonLabel: 'Open and Render',
  });

  if (result.canceled) return;
  if (result.filePaths.length === 0) return;

  const [path] = result.filePaths;
  const content = await readFile(path, 'utf-8');

  return {
    path,
    content,
  };
};
