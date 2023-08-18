import { ipcRenderer, contextBridge } from 'electron';
import Elements from './renderer/elements';
import { renderMarkdown } from './renderer/markdown';

ipcRenderer.on('file-opened', (_, content: string) => {
  Elements.MarkdownView.value = content;
  renderMarkdown(content);
});

contextBridge.exposeInMainWorld('api', {
  showOpenDialog: () => {
    ipcRenderer.send('show-open-dialog');
  },
});
