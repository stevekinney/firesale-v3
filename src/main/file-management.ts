import { readFile, writeFile } from 'node:fs/promises';
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';

export const setEditedStatus = (
  browserWindow: BrowserWindow,
  edited: boolean,
) => {
  browserWindow.setDocumentEdited(edited);
};

export const setCurrentFilePath = (
  browserWindow: BrowserWindow,
  path: string,
) => {
  browserWindow.setRepresentedFilename(path);
  app.addRecentDocument(path);
  setEditedStatus(browserWindow, false);
};

export const openFile = async (path: string, browserWindow: BrowserWindow) => {
  const content = await readFile(path, 'utf-8');

  setCurrentFilePath(browserWindow, path);

  return {
    path,
    content,
  };
};

export const showOpenDialog = async (browserWindow: BrowserWindow) => {
  const result = await dialog.showOpenDialog(browserWindow, {
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

  return openFile(path, browserWindow);
};

export const saveMarkdown = async (
  browserWindow: BrowserWindow,
  content: string,
  path?: string,
) => {
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

  setCurrentFilePath(browserWindow, path);

  return { path };
};

export const saveHTML = async (browserWindow: BrowserWindow, html: string) => {
  const result = await dialog.showSaveDialog(browserWindow, {
    title: 'Export HTML',
    filters: [{ name: 'HTML', extensions: ['html'] }],
    message: 'Export HTML',
    buttonLabel: 'Export',
  });

  if (result.canceled) return;
  if (!result.filePath) return;

  return writeFile(result.filePath, html, 'utf-8');
};

export const setupIpcHandlers = () => {
  ipcMain.handle('open-file', (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);

    if (!browserWindow) return;

    return showOpenDialog(browserWindow);
  });

  ipcMain.handle(
    'save-markdown',
    async (event, content: string, path?: string) => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender);

      if (!browserWindow) return;

      return saveMarkdown(browserWindow, content, path);
    },
  );

  ipcMain.handle('save-html', async (event, html: string) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);

    if (!browserWindow) return;

    saveHTML(browserWindow, html);
  });

  ipcMain.on('set-current-file-path', (event, path: string) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);

    if (!browserWindow) return;

    setCurrentFilePath(browserWindow, path);
  });

  ipcMain.handle('set-edited-status', (event, isEdited: boolean) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);

    if (!browserWindow) return;

    setEditedStatus(browserWindow, isEdited);
  });

  ipcMain.handle('show-file', (_, path: string) => {
    shell.showItemInFolder(path);
  });

  ipcMain.handle('open-in-default-application', (_, path: string) => {
    shell.openPath(path);
  });
};
