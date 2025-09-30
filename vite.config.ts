import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// مهم: base لازم يكون اسم الريبو نفسه
export default defineConfig({
  plugins: [react()],
  base: '/Khaled-entrepreneurships/',
})
