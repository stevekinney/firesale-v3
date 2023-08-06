import { contextBridge, ipcRenderer } from 'electron';

let currentFilePath: string | undefined;

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
    currentFilePath = path;
    ipcRenderer.send('set-current-file-path', path);
  },
} as const;

contextBridge.exposeInMainWorld('file', FileAPI);

export type FileAPI = typeof FileAPI;

ipcRenderer.on('save-file-from-menu', async () => {
  const Markdown = document.getElementById('markdown') as HTMLTextAreaElement;
  const { path } = await FileAPI.saveMarkdown(Markdown.value, currentFilePath);
  FileAPI.setCurrentFilePath(path);
});

ipcRenderer.on('save-html-from-menu', () => {
  const Rendered = document.getElementById('html') as HTMLDivElement;
  FileAPI.saveHTML(Rendered.innerHTML);
});
