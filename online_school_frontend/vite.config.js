import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/auth/register': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth\/register$/, '/src/register.html'),
      },
      '/attendance': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) =>  path.replace(/^\/attendance$/, '/src/attendance.html'),
      },
      '/admin/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) =>  path.replace(/^\/admin\/users$/, '/src/users.html'),
      }
    },
  },
});
