import './index.css';
import { toHTML } from './markdown';
import {
  Markdown,
  OpenFile,
  OpenInDefaultApplication,
  Rendered,
  SaveHtml,
  SaveMarkdown,
  ShowFile,
} from './elements';

let currentFilePath: string | undefined;
let lastSavedMarkdown: string | undefined;

const updateCurrentFile = (path?: string) => {
  let title = 'Firesale';

  const isEdited = hasUnsavedChanges(Markdown.value);

  currentFilePath = path;

  SaveMarkdown.disabled = !isEdited;
  ShowFile.disabled = !currentFilePath;
  OpenInDefaultApplication.disabled = !currentFilePath;

  window.file.setEditedStatus(isEdited);

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

ShowFile.addEventListener('click', async () => {
  if (!currentFilePath) return;

  await window.file.showFile(currentFilePath);
});

OpenInDefaultApplication.addEventListener('click', async () => {
  if (!currentFilePath) return;

  await window.file.openInDefaultApplication(currentFilePath);
});

document.addEventListener('dragstart', (event) => event.preventDefault());
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('dragleave', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());

const getDraggedFile = (event: DragEvent) => {
  return event.dataTransfer?.items?.[0];
};

const getDroppedFile = (event: DragEvent) => {
  return event.dataTransfer?.files?.[0];
};

const fileTypeIsSupported = (file: File | DataTransferItem): boolean => {
  if (file.type === 'text/markdown') return true;
  if (file.type === 'text/plain') return true;
  return false;
};

Markdown.addEventListener('dragover', (event) => {
  const file = getDraggedFile(event);
  if (!file) return;

  if (fileTypeIsSupported(file)) {
    Markdown.classList.add('drag-over');
  } else {
    Markdown.classList.add('drag-error');
  }
});

Markdown.addEventListener('dragleave', () => {
  Markdown.classList.remove('drag-over');
  Markdown.classList.remove('drag-error');
});

Markdown.addEventListener('drop', async (event) => {
  Markdown.classList.remove('drag-over');
  Markdown.classList.remove('drag-error');

  const file = getDroppedFile(event);

  if (!file) return;

  if (!fileTypeIsSupported(file)) {
    return;
  }

  const content = await file.text();
  Markdown.value = content;
  renderMarkdown(content);
});
