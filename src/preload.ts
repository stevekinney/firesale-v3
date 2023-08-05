import { toHTML } from '@lib/markdown';
import { ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('file-opened', async (_, file) => {
    const html = await toHTML(file);
    const Markdown = document.getElementById('markdown') as HTMLTextAreaElement;
    const Rendered = document.getElementById('html') as HTMLDivElement;
    Markdown.value = file;
    Rendered.innerHTML = html;
  });
});
