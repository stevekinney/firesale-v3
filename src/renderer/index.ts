import '@styles/index.css';
import { toHTML } from '@lib/markdown';
import { Markdown, Rendered } from './elements';

Markdown.addEventListener('input', async () => {
  const markdown = Markdown.value;
  const html = await toHTML(markdown);
  Rendered.innerHTML = html;
});
