import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import NodeCGPlugin from 'vite-plugin-nodecg';
import checker from 'vite-plugin-checker';
import { globbySync } from 'globby';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({ vueTsc: { tsconfigPath: 'tsconfig.browser.json' } }),
    NodeCGPlugin({
      // We need to set up the inputs like this to work around an issue where the plugin would try to write out these files to the wrong place:
      // https://github.com/Dan-Shields/vite-plugin-nodecg/issues/5
      inputs: {
        './src/dashboard/*.{js,ts}': './src/dashboard/template.html',
      }
    })
  ],
  resolve: {
    alias: {
      '@nodecg-ticker': path.resolve(__dirname, 'src', 'dashboard')
    }
  },
  build: {
    rollupOptions: {
      input: globbySync([
        './src/dashboard/*.ts',
        './src/graphics/*.ts',
        '!**.d.ts',
      ]),
    },
  },
})
