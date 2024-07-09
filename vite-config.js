import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'openbim-components': resolve(__dirname, 'node_modules/openbim-components/dist/index.js')
    }
  }
});
