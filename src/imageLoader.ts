/**
 * Async image loader using dynamic imports for code splitting.
 * Only the single image needed for the current moon phase is loaded at runtime.
 * Default format: JPEG.
 */

type ImageModule = { default: string };

const loaders: Record<number, () => Promise<ImageModule>> = {
  2: () => import('./images/moon-2'),
  3: () => import('./images/moon-3'),
  4: () => import('./images/moon-4'),
  5: () => import('./images/moon-5'),
  6: () => import('./images/moon-6'),
  7: () => import('./images/moon-7'),
  8: () => import('./images/moon-8'),
  9: () => import('./images/moon-9'),
  10: () => import('./images/moon-10'),
  11: () => import('./images/moon-11'),
  12: () => import('./images/moon-12'),
  13: () => import('./images/moon-13'),
  14: () => import('./images/moon-14'),
  15: () => import('./images/moon-15'),
  16: () => import('./images/moon-16'),
  17: () => import('./images/moon-17'),
  18: () => import('./images/moon-18'),
  19: () => import('./images/moon-19'),
  20: () => import('./images/moon-20'),
  21: () => import('./images/moon-21'),
  22: () => import('./images/moon-22'),
  23: () => import('./images/moon-23'),
  24: () => import('./images/moon-24'),
  25: () => import('./images/moon-25'),
  26: () => import('./images/moon-26'),
  27: () => import('./images/moon-27'),
  28: () => import('./images/moon-28'),
};

/**
 * Load a moon image by index (2–28) using dynamic imports.
 * The consumer's bundler will code-split each image into its own chunk.
 */
export async function loadMoonImage(index: number): Promise<string> {
  const loader = loaders[index] ?? loaders[2];
  const mod = await loader();
  return mod.default;
}
