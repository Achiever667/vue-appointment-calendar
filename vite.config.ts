import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(() => {
  const isLibraryBuild = process.env.BUILD_TARGET === 'lib'

  return {
    plugins: [
      vue(),
      ...(isLibraryBuild
        ? [
            dts({
              entryRoot: 'src',
              include: ['src/**/*.ts', 'src/**/*.vue'],
              exclude: ['src/app/**'],
              insertTypesEntry: true
            })
          ]
        : [])
    ],
    build: isLibraryBuild
      ? {
          outDir: 'dist',
          emptyOutDir: true,
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueAppointmentCalendar',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue'
              }
            }
          }
        }
      : {
          outDir: 'dist',
          emptyOutDir: true
        }
  }
})
