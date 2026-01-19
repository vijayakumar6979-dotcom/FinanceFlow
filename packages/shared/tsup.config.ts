import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false, // Temporarily disabled to fix build
    clean: true,
    splitting: false,
    sourcemap: true,
    outDir: 'dist',
})
