import { toHTML } from './markdown';
import { MarkdownView, RenderedView } from './elements';

MarkdownView.addEventListener('input', async () => {
  const markdown = MarkdownView.value;
  const html = await toHTML(markdown);
  RenderedView.innerHTML = html;
});
