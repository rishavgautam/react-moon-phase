/**
 * Async image loader using dynamic imports for code splitting.
 * PNG format variant — pass this to the `imageLoader` prop for original PNG images.
 */

type ImageModule = { default: string };

const loaders: Record<number, () => Promise<ImageModule>> = {
  2: () => import('./images-png/moon-2'),
  3: () => import('./images-png/moon-3'),
  4: () => import('./images-png/moon-4'),
  5: () => import('./images-png/moon-5'),
  6: () => import('./images-png/moon-6'),
  7: () => import('./images-png/moon-7'),
  8: () => import('./images-png/moon-8'),
  9: () => import('./images-png/moon-9'),
  10: () => import('./images-png/moon-10'),
  11: () => import('./images-png/moon-11'),
  12: () => import('./images-png/moon-12'),
  13: () => import('./images-png/moon-13'),
  14: () => import('./images-png/moon-14'),
  15: () => import('./images-png/moon-15'),
  16: () => import('./images-png/moon-16'),
  17: () => import('./images-png/moon-17'),
  18: () => import('./images-png/moon-18'),
  19: () => import('./images-png/moon-19'),
  20: () => import('./images-png/moon-20'),
  21: () => import('./images-png/moon-21'),
  22: () => import('./images-png/moon-22'),
  23: () => import('./images-png/moon-23'),
  24: () => import('./images-png/moon-24'),
  25: () => import('./images-png/moon-25'),
  26: () => import('./images-png/moon-26'),
  27: () => import('./images-png/moon-27'),
  28: () => import('./images-png/moon-28'),
};

/**
 * Load a moon image by index (2–28) using dynamic imports (PNG format).
 * The consumer's bundler will code-split each image into its own chunk.
 */
export async function loadMoonImagePng(index: number): Promise<string> {
  const loader = loaders[index] ?? loaders[2];
  const mod = await loader();
  return mod.default;
}
