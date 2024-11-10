import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['index.ts'],
    format: ['esm','cjs'],
    clean: true,
    sourcemap: true,
    dts: true,
})