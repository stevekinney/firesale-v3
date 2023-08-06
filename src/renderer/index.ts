import './index.css';
import { toHTML } from './markdown';
import {
  Markdown,
  OpenFile,
  Rendered,
  SaveHtml,
  SaveMarkdown,
} from './elements';

let currentFilePath: string | undefined;
let lastSavedMarkdown: string | undefined;

const updateCurrentFile = (path?: string) => {
  let title = 'Firesale';

  const isEdited = hasUnsavedChanges(Markdown.value);

  currentFilePath = path;
  SaveMarkdown.disabled = !isEdited;

  if (path) {
    title = `${path} — ${title}`;
  }

  if (isEdited) {
    title = `${title} (Edited)`;
  }

  document.title = title;
};

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

  updateCurrentFile(currentFilePath);

  Rendered.innerHTML = html;
});

OpenFile.addEventListener('click', async () => {
  const file = await window.file.open();
  if (!file) return;

  lastSavedMarkdown = file.content;
  Markdown.value = file.content;
  updateCurrentFile(file.path);

  renderMarkdown(file.content);
});

SaveMarkdown.addEventListener('click', async () => {
  const content = Markdown.value;
  if (!content) return;

  const { path } = await window.file.saveMarkdown(
    content,
    currentFilePath || '',
  );

  lastSavedMarkdown = content;
  updateCurrentFile(path);
});

SaveHtml.addEventListener('click', async () => {
  const html = Rendered.innerHTML;
  if (!html) return;

  window.file.saveHTML(html);
});
