// import { defineConfig } from 'vite';

// // https://vitejs.dev/config
// export default defineConfig({});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    react(), // Since we have React installed
    tailwindcss(), // TailwindCSS v4 Vite plugin
  ],
});