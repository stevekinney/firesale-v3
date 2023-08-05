import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('file', {
  open: async () => {
    return ipcRenderer.invoke('open-file');
  },
  saveHTML: async (html: string) => {
    return ipcRenderer.invoke('save-html', html);
  },
});
