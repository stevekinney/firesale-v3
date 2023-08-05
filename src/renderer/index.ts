import './index.css';
import { toHTML } from './markdown';
import { Markdown, OpenFile, Rendered, SaveHtml } from './elements';

let currentFilePath: string;

const renderMarkdown = async (content: string) => {
  const html = await toHTML(content);
  Rendered.innerHTML = html;
};

Markdown.addEventListener('input', async () => {
  const markdown = Markdown.value;
  const html = await toHTML(markdown);
  Rendered.innerHTML = html;
});

OpenFile.addEventListener('click', async () => {
  const file = await window.file.open();
  if (!file) return;

  currentFilePath = file.path;

  Markdown.value = file.content;
  renderMarkdown(file.content);
});

SaveHtml.addEventListener('click', async () => {
  const html = Rendered.innerHTML;
  if (!html) return;

  window.file.saveHTML(html);
});
