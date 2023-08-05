import './index.css';
import { toHTML } from './markdown';
import { Markdown, OpenFile, Rendered } from './elements';

Markdown.addEventListener('input', async () => {
  const markdown = Markdown.value;
  const html = await toHTML(markdown);
  Rendered.innerHTML = html;
});

OpenFile.addEventListener('click', () => {
  window.file.open();
});
