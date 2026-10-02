/** vite.config.ts – To-Do ++ Build Configuration */
import { defineConfig } from 'vite'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: 'index.html',
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    cssCodeSplit: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  plugins: [],
})