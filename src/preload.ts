import { toHTML } from './renderer/markdown';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('file', {
  open: async () => {
    ipcRenderer.invoke('open-file');
  },
});

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('file-opened', async (_, file) => {
    const html = await toHTML(file);
    const Markdown = document.getElementById('markdown') as HTMLTextAreaElement;
    const Rendered = document.getElementById('html') as HTMLDivElement;
    Markdown.value = file;
    Rendered.innerHTML = html;
  });
});
