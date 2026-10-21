import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Add this line, matching your exact GitHub repository name:
  base: '/maple-app/',

  server: {
    port: 3010,
    host: '0.0.0.0',
  },
});
