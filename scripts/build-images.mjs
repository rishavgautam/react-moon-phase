/**
 * Convert raw PNG moon images to JPEG, WebP, and optimized PNG, then generate
 * individual TypeScript modules for code splitting.
 *
 * Usage: node scripts/build-images.mjs
 */
import sharp from 'sharp';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const rawDir = join(root, 'raw-images');
const jpegOutDir = join(root, 'src', 'images');
const webpOutDir = join(root, 'src', 'images-webp');
const pngOutDir = join(root, 'src', 'images-png');

mkdirSync(jpegOutDir, { recursive: true });
mkdirSync(webpOutDir, { recursive: true });
mkdirSync(pngOutDir, { recursive: true });

const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

const files = readdirSync(rawDir)
  .filter(f => f.startsWith('moon-') && f.endsWith('.png'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/(\d+)/)[1]);
    const numB = parseInt(b.match(/(\d+)/)[1]);
    return numA - numB;
  });

let totalPngSize = 0;
let totalJpegSize = 0;
let totalWebpSize = 0;

for (const file of files) {
  const index = file.match(/(\d+)/)[1];
  const inputPath = join(rawDir, file);
  const pngBuffer = readFileSync(inputPath);
  totalPngSize += pngBuffer.length;

  // PNG module (original format)
  const pngBase64 = pngBuffer.toString('base64');
  const pngModule = `const image: string = 'data:image/png;base64,${pngBase64}';\nexport default image;\n`;
  writeFileSync(join(pngOutDir, `moon-${index}.ts`), pngModule);

  // Convert to JPEG
  const jpegBuffer = await sharp(inputPath)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
  totalJpegSize += jpegBuffer.length;

  const jpegBase64 = jpegBuffer.toString('base64');
  const jpegModule = `const image: string = 'data:image/jpeg;base64,${jpegBase64}';\nexport default image;\n`;
  writeFileSync(join(jpegOutDir, `moon-${index}.ts`), jpegModule);

  // Convert to WebP
  const webpBuffer = await sharp(inputPath)
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  totalWebpSize += webpBuffer.length;

  const webpBase64 = webpBuffer.toString('base64');
  const webpModule = `const image: string = 'data:image/webp;base64,${webpBase64}';\nexport default image;\n`;
  writeFileSync(join(webpOutDir, `moon-${index}.ts`), webpModule);

  console.log(`moon-${index}: PNG ${pngBuffer.length}B → JPEG ${jpegBuffer.length}B, WebP ${webpBuffer.length}B`);
}

console.log('\n--- Summary ---');
console.log(`Total PNG:  ${(totalPngSize / 1024).toFixed(1)} KB (original)`);
console.log(`Total JPEG: ${(totalJpegSize / 1024).toFixed(1)} KB (${((1 - totalJpegSize / totalPngSize) * 100).toFixed(1)}% reduction)`);
console.log(`Total WebP: ${(totalWebpSize / 1024).toFixed(1)} KB (${((1 - totalWebpSize / totalPngSize) * 100).toFixed(1)}% reduction)`);
console.log(`\nGenerated ${files.length} modules each in:`);
console.log(`  src/images/      (JPEG)`);
console.log(`  src/images-webp/ (WebP)`);
console.log(`  src/images-png/  (PNG)`);
