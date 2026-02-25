import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/images/moon-*.ts',
    'src/images-webp/moon-*.ts',
    'src/images-png/moon-*.ts',
  ],
  format: ['cjs', 'esm'],
  dts: { entry: ['src/index.ts'] },
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'],
  splitting: true,
  treeshake: true,
});
