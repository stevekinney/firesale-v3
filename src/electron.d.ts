/// <reference types="vite/client" />
/// <reference types="electron" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

type MarkdownFile = {
  path: string;
  content: string;
};

declare interface Window {
  file: {
    open: () => Promise<MarkdownFile | undefined>;
    saveMarkdown: (
      content: string,
      filePath?: string,
    ) => Promise<{ path: string }>;
    saveHTML: (html: string) => Promise<void>;
    setEditedStatus: (isEdited: boolean) => void;
  };
}
