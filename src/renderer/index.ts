import { toHTML } from './markdown';
import { Markdown, Rendered } from './elements';

Markdown.addEventListener('input', async () => {
  const markdown = Markdown.value;
  const html = await toHTML(markdown);
  Rendered.innerHTML = html;
});
