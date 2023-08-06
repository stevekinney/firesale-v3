import { contextBridge, ipcRenderer } from 'electron';

const FileAPI = {
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
} as const;

contextBridge.exposeInMainWorld('file', FileAPI);

export type FileAPI = typeof FileAPI;

ipcRenderer.on('save-file-from-menu', () => {
  const Markdown = document.getElementById('markdown') as HTMLTextAreaElement;
  FileAPI.saveMarkdown(Markdown.value);
});
