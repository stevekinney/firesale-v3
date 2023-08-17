import { Preset, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import Elements from './elements';

export const renderMarkdown = async (markdown: string): Promise<void> => {
  const html = await toHTML(markdown);
  Elements.RenderedView.innerHTML = html;
};

export const toHTML = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse as Preset)
    .use(remarkGfm as Preset)
    .use(remarkRehype as Preset)
    .use(rehypeStringify as Preset)
    .process(markdown);

  return file.toString();
};
