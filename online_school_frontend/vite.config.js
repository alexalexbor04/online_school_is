import { defineConfig } from 'vite';
// import {patch} from "axios";


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
      },
      '/schedule': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) =>  path.replace(/^\/schedule$/, '/src/schedule.html'),
      },
      '/courses': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/courses$/, '/src/courses.html'),
      },
      '/grades': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/grades$/, '/src/grades.html'),
      },
      '/materials': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/materials$/, '/src/materials.html'),
      },
      '/about': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/about$/, '/src/about.html'),
      }
    },
  },
});
