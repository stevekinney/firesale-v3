const Elements = {
  get MarkdownView() {
    return document.getElementById('markdown-view') as HTMLTextAreaElement;
  },
  get RenderedView() {
    return document.getElementById('rendered-view') as HTMLDivElement;
  },
  get NewFileButton() {
    return document.getElementById('new-file') as HTMLButtonElement;
  },
  get OpenFileButton() {
    return document.getElementById('open-file') as HTMLButtonElement;
  },
  get SaveMarkdownButton() {
    return document.getElementById('save-markdown') as HTMLButtonElement;
  },
  get RevertButton() {
    return document.getElementById('revert') as HTMLButtonElement;
  },
  get ExportHtmlButton() {
    return document.getElementById('export-html') as HTMLButtonElement;
  },
  get ShowFileButton() {
    return document.getElementById('show-file') as HTMLButtonElement;
  },
  get OpenInDefaultApplicationButton() {
    return document.getElementById(
      'open-in-default-application',
    ) as HTMLButtonElement;
  },
};

export default Elements;
