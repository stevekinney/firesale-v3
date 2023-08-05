import { mergeConfig } from 'vite';
import common from './vite.common.config.mjs';

export default mergeConfig(common, {
  build: {
    lib: {
      entry: './src/main',
      fileName: 'main',
    },
  },
  resolve: {
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});
