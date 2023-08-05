import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('file', {
  open: async () => {
    return ipcRenderer.invoke('open-file');
  },
});
