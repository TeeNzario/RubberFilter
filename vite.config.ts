import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* Use './' so the build works both at repo root and in a GitHub Pages subdirectory */
  base: '/RubberFilter/',
});
