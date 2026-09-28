import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const isSandboxed =
    process.env.VITE_SANDBOX === 'true' ||
    process.env.SANDBOXED === 'true' ||
    process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Container infrastructure routes via Express on port 3000
      hmr: isSandboxed ? false : { protocol: 'ws', host: 'localhost' },
      watch: isSandboxed ? null : {},
    },
  };
});
