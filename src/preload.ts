import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('file', {
  open: async () => {
    return ipcRenderer.invoke('open-file');
  },
  saveHTML: async (html: string) => {
    return ipcRenderer.invoke('save-html', html);
  },
  saveMarkdown: async (content: string, filePath?: string) => {
    return ipcRenderer.invoke('save-markdown', content, filePath);
  },
  setEditedStatus: (isEdited: boolean) => {
    ipcRenderer.invoke('set-edited-status', isEdited);
  },
  showFile: async (path: string) => {
    return ipcRenderer.invoke('show-file', path);
  },
  openInDefaultApplication: async (path: string) => {
    return ipcRenderer.invoke('open-in-default-application', path);
  },
  setCurrentFilePath: (path: string) => {
    ipcRenderer.send('set-current-file-path', path);
  },
});
