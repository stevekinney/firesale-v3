import './index.css';
import { toHTML } from './markdown';
import {
  Markdown,
  OpenFile,
  Rendered,
  SaveHtml,
  SaveMarkdown,
} from './elements';

let currentFilePath: string;
let lastSavedMarkdown: string;

const renderMarkdown = async (content: string) => {
  const html = await toHTML(content);
  Rendered.innerHTML = html;
};

const hasUnsavedChanges = (markdown: string): boolean => {
  if (!markdown) return false;
  return lastSavedMarkdown !== markdown;
};

Markdown.addEventListener('input', async () => {
  const markdown = Markdown.value;
  const html = await toHTML(markdown);

  SaveMarkdown.disabled = !hasUnsavedChanges(markdown);

  Rendered.innerHTML = html;
});

OpenFile.addEventListener('click', async () => {
  const file = await window.file.open();
  if (!file) return;

  updateCurrentFile(file.path, file.content);
  lastSavedMarkdown = file.content;

  Markdown.value = file.content;
  renderMarkdown(file.content);
});

SaveMarkdown.addEventListener('click', async () => {
  const content = Markdown.value;
  if (!content) return;

  const { path } = await window.file.saveMarkdown(
    content,
    currentFilePath || '',
  );

  updateCurrentFile(path, content);
  lastSavedMarkdown = content;
});

SaveHtml.addEventListener('click', async () => {
  const html = Rendered.innerHTML;
  if (!html) return;

  window.file.saveHTML(html);
});
