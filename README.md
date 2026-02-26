# moon-phase-illuminated

Beautiful React moon phase component using real NASA imagery. Zero config — just drop it in.

![npm](https://img.shields.io/npm/v/moon-phase-illuminated)
![bundle size](https://img.shields.io/bundlephobia/minzip/moon-phase-illuminated)
![license](https://img.shields.io/npm/l/moon-phase-illuminated)

## Features

- 27 real NASA photographs covering the full lunar cycle
- Auto-calculates current moon phase — just render `<MoonPhase />`
- `<AnimatedMoon />` component for a smooth rotating moon animation
- Pass any `Date` or override with a specific `phase` (0–1)
- Render prop API for custom UI
- TypeScript first, tree-shakeable
- Zero dependencies (only React as peer dep)
- Code-split images — only the single image needed is loaded at runtime
- JPEG (default), WebP, and original PNG formats available
- Custom `imageLoader` prop for full control over image loading

## Install

```bash
npm install moon-phase-illuminated
```

## Usage

### Basic — today's moon

```tsx
import { MoonPhase } from 'moon-phase-illuminated';

function App() {
  return <MoonPhase size={120} />;
}
```

### Specific date

```tsx
<MoonPhase date={new Date('2024-12-25')} size={80} />
```

### Override phase directly

```tsx
// 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
<MoonPhase phase={0.5} size={64} />
```

### Custom styling

```tsx
<MoonPhase
  size={100}
  className="shadow-lg"
  style={{ border: '2px solid #333' }}
/>
```

### Use WebP images

```tsx
import { MoonPhase, loadMoonImageWebp } from 'moon-phase-illuminated';

<MoonPhase imageLoader={loadMoonImageWebp} size={120} />
```

### Use original PNG images

```tsx
import { MoonPhase, loadMoonImagePng } from 'moon-phase-illuminated';

<MoonPhase imageLoader={loadMoonImagePng} size={120} />
```

### Render prop for custom UI

```tsx
<MoonPhase date={new Date()}>
  {({ imageSrc, name, illumination, phase }) => (
    <div style={{ textAlign: 'center' }}>
      {imageSrc && <img src={imageSrc} alt={name} width={96} height={96} style={{ borderRadius: '50%' }} />}
      <h3>{name}</h3>
      <p>{Math.round(illumination * 100)}% illuminated</p>
      <p>Phase: {phase.toFixed(3)}</p>
    </div>
  )}
</MoonPhase>
```

> **Note:** `imageSrc` may be `null` while the image is loading asynchronously. Always check before rendering.

### Animated rotating moon

```tsx
import { AnimatedMoon } from 'moon-phase-illuminated';

// Default — 12 fps, 96px
<AnimatedMoon size={120} />

// Slower rotation with WebP images
import { AnimatedMoon, loadMoonImageWebp } from 'moon-phase-illuminated';
<AnimatedMoon fps={6} size={200} imageLoader={loadMoonImageWebp} />
```

### Use the calculation without the component

```ts
import { getMoonPhase } from 'moon-phase-illuminated';

const { phase, name, illumination } = getMoonPhase(); // now
const christmas = getMoonPhase(new Date('2024-12-25'));
console.log(christmas.name); // e.g. "Waning Crescent"
```

## API

### `<MoonPhase />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | `new Date()` | Date to calculate the moon phase for |
| `phase` | `number` | — | Override with a phase fraction (0–1). Overrides `date`. |
| `size` | `number` | `96` | Image width/height in pixels |
| `className` | `string` | — | CSS class on the container |
| `style` | `CSSProperties` | — | Inline styles on the container |
| `alt` | `string` | Phase name | Alt text for the image |
| `imageLoader` | `(index: number) => Promise<string>` | JPEG loader | Custom image loader. Use `loadMoonImageWebp` for WebP or `loadMoonImagePng` for original PNG. |
| `children` | `(data) => ReactNode` | — | Render prop for custom UI (`imageSrc` may be `null` while loading) |

### `<AnimatedMoon />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fps` | `number` | `12` | Frames per second for the rotation |
| `size` | `number` | `96` | Image width/height in pixels |
| `className` | `string` | — | CSS class on the image element |
| `style` | `CSSProperties` | — | Inline styles on the image element |
| `alt` | `string` | `"Moon rotation"` | Alt text for the image |
| `imageLoader` | `(index: number) => Promise<string>` | JPEG loader | Custom image loader |

### `getMoonPhase(date?)`

Returns `MoonPhaseData`:

```ts
{
  phase: number;        // 0–1, 0 = New Moon, 0.5 = Full Moon
  name: MoonPhaseName;  // "New Moon" | "Waxing Crescent" | ... | "Waning Crescent"
  illumination: number; // 0–1, 0 = dark, 1 = fully lit
}
```

### `getImageIndex(phase)`

Maps a phase fraction (0–1) to an image index (2–28). Useful if you want to load images yourself.

## Phase Names

| Phase Range | Name |
|-------------|------|
| 0.000 – 0.033 | New Moon |
| 0.033 – 0.243 | Waxing Crescent |
| 0.243 – 0.277 | First Quarter |
| 0.277 – 0.493 | Waxing Gibbous |
| 0.493 – 0.533 | Full Moon |
| 0.533 – 0.743 | Waning Gibbous |
| 0.743 – 0.777 | Last Quarter |
| 0.777 – 1.000 | Waning Crescent |

## How It Works

The component calculates the moon's position in its ~29.53-day synodic cycle using the Julian Day method, relative to a known new moon (January 6, 2000). This maps to one of 27 photographs from NASA's Scientific Visualization Studio, each covering ~13.3° of the lunar cycle.

Images are code-split into individual modules. Only the single image matching the current moon phase is loaded at runtime via dynamic `import()`, keeping the initial bundle at ~6 KB. The consumer's bundler (Webpack, Vite, Next.js, etc.) handles the splitting automatically.

## Credits

Moon phase imagery courtesy [NASA/Goddard Space Flight Center Scientific Visualization Studio](https://svs.gsfc.nasa.gov/).

## License

MIT
