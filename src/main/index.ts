import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  shell,
  type WebContents,
} from 'electron';
import { readFile, writeFile } from 'node:fs/promises';
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

ipcMain.handle(
  'save-markdown',
  async (event, content: string, path?: string) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);

    if (!browserWindow) return;

    if (!path) {
      const result = await dialog.showSaveDialog(browserWindow, {
        title: 'Save Markdown',
        filters: [{ name: 'Markdown', extensions: ['md'] }],
        message: 'Save Markdown',
        buttonLabel: 'Save',
      });

      if (result.canceled) return;
      if (!result.filePath) return;

      path = result.filePath;
    }

    try {
      await writeFile(path, content, 'utf-8');
    } catch (error) {
      console.error(error);
    }

    browserWindow.setRepresentedFilename(path);
    app.addRecentDocument(path);

    return { path };
  },
);

ipcMain.handle('save-html', async (event, html: string) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  const result = await dialog.showSaveDialog(browserWindow, {
    title: 'Export HTML',
    filters: [{ name: 'HTML', extensions: ['html'] }],
    message: 'Export HTML',
    buttonLabel: 'Export',
  });

  if (result.canceled) return;
  if (!result.filePath) return;

  return writeFile(result.filePath, html, 'utf-8');
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

  browserWindow.setRepresentedFilename(path);
  app.addRecentDocument(path);

  return {
    path,
    content,
  };
};

const setEditedStatus = (browserWindow: BrowserWindow, edited: boolean) => {
  browserWindow.setDocumentEdited(edited);
};

ipcMain.handle('set-edited-status', (event, isEdited: boolean) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);

  if (!browserWindow) return;

  setEditedStatus(browserWindow, isEdited);
});

ipcMain.handle('show-file', (_, path: string) => {
  shell.showItemInFolder(path);
});
