/**
 * Async image loader using dynamic imports for code splitting.
 * WebP format variant — pass this to the `imageLoader` prop for WebP images.
 */

type ImageModule = { default: string };

const loaders: Record<number, () => Promise<ImageModule>> = {
  2: () => import('./images-webp/moon-2'),
  3: () => import('./images-webp/moon-3'),
  4: () => import('./images-webp/moon-4'),
  5: () => import('./images-webp/moon-5'),
  6: () => import('./images-webp/moon-6'),
  7: () => import('./images-webp/moon-7'),
  8: () => import('./images-webp/moon-8'),
  9: () => import('./images-webp/moon-9'),
  10: () => import('./images-webp/moon-10'),
  11: () => import('./images-webp/moon-11'),
  12: () => import('./images-webp/moon-12'),
  13: () => import('./images-webp/moon-13'),
  14: () => import('./images-webp/moon-14'),
  15: () => import('./images-webp/moon-15'),
  16: () => import('./images-webp/moon-16'),
  17: () => import('./images-webp/moon-17'),
  18: () => import('./images-webp/moon-18'),
  19: () => import('./images-webp/moon-19'),
  20: () => import('./images-webp/moon-20'),
  21: () => import('./images-webp/moon-21'),
  22: () => import('./images-webp/moon-22'),
  23: () => import('./images-webp/moon-23'),
  24: () => import('./images-webp/moon-24'),
  25: () => import('./images-webp/moon-25'),
  26: () => import('./images-webp/moon-26'),
  27: () => import('./images-webp/moon-27'),
  28: () => import('./images-webp/moon-28'),
};

/**
 * Load a moon image by index (2–28) using dynamic imports (WebP format).
 * The consumer's bundler will code-split each image into its own chunk.
 */
export async function loadMoonImageWebp(index: number): Promise<string> {
  const loader = loaders[index] ?? loaders[2];
  const mod = await loader();
  return mod.default;
}
