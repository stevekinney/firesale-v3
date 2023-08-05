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
  };
}
