/**
 * Extract PNG images from the current base64 data in src/images.ts
 * into raw-images/ directory as individual PNG files.
 *
 * Run once: node scripts/extract-images.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const source = readFileSync(join(root, 'src/images.ts'), 'utf8');

// Match each entry: number: 'data:image/png;base64,...'
const regex = /(\d+):\s*'data:image\/png;base64,([^']+)'/g;
let match;
let count = 0;

while ((match = regex.exec(source)) !== null) {
  const index = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  const outPath = join(root, 'raw-images', `moon-${index}.png`);
  writeFileSync(outPath, buffer);
  count++;
  console.log(`Extracted moon-${index}.png (${buffer.length} bytes)`);
}

console.log(`\nDone — extracted ${count} images to raw-images/`);
