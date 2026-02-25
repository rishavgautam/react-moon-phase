import React, { useState, useEffect } from 'react';
import { loadMoonImage } from './imageLoader';
import { getMoonPhase, getImageIndex } from './moonCalc';
import type { MoonPhaseName, MoonPhaseData } from './moonCalc';

/** Function that loads a moon image by index (2–28) and returns its data URI. */
export type MoonImageLoader = (index: number) => Promise<string>;

export interface MoonPhaseProps {
  /** Date to display the moon for. Defaults to now. */
  date?: Date;
  /** Override with a specific phase fraction (0–1). 0 = New Moon, 0.5 = Full Moon. */
  phase?: number;
  /** Size in pixels. Default: 96 */
  size?: number;
  /** CSS class name applied to the outer container. */
  className?: string;
  /** Inline styles applied to the outer container. */
  style?: React.CSSProperties;
  /** Alt text for the moon image. Defaults to the phase name. */
  alt?: string;
  /**
   * Custom image loader. Defaults to the built-in JPEG loader.
   * Use `loadMoonImageWebp` for WebP images.
   */
  imageLoader?: MoonImageLoader;
  /**
   * Render prop — receives computed moon data so you can build custom UI.
   * When provided, replaces the default image rendering.
   * Note: `imageSrc` may be `null` while the image is loading.
   */
  children?: (data: MoonPhaseRenderData) => React.ReactNode;
}

export interface MoonPhaseRenderData extends MoonPhaseData {
  /** Base64 data URI of the moon image, or null while loading */
  imageSrc: string | null;
  /** Image index (2–28) used for the current phase */
  imageIndex: number;
}

/**
 * Displays a realistic moon phase image based on the current date or a given date/phase.
 *
 * Uses 27 pre-rendered NASA Scientific Visualization Studio photographs
 * covering the full lunar cycle. Images are loaded on demand via dynamic
 * imports — only the single image needed is fetched at runtime.
 *
 * @example
 * // Basic — shows today's moon
 * <MoonPhase />
 *
 * @example
 * // Specific date
 * <MoonPhase date={new Date('2024-12-25')} size={120} />
 *
 * @example
 * // Override phase directly (0.5 = full moon)
 * <MoonPhase phase={0.5} size={64} />
 *
 * @example
 * // Render prop for custom UI
 * <MoonPhase date={new Date()}>
 *   {({ imageSrc, name, illumination }) => (
 *     <div>
 *       {imageSrc && <img src={imageSrc} alt={name} />}
 *       <p>{name} — {Math.round(illumination * 100)}% illuminated</p>
 *     </div>
 *   )}
 * </MoonPhase>
 */
export function MoonPhase({
  date,
  phase: phaseOverride,
  size = 96,
  className,
  style,
  alt,
  imageLoader = loadMoonImage,
  children,
}: MoonPhaseProps) {
  const computed = getMoonPhase(date);

  const phase = phaseOverride ?? computed.phase;
  const illumination =
    phaseOverride != null
      ? (1 - Math.cos(2 * Math.PI * phaseOverride)) / 2
      : computed.illumination;
  const name: MoonPhaseName =
    phaseOverride != null ? getPhaseName(phaseOverride) : computed.name;

  const imageIndex = getImageIndex(phase);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setImageSrc(null);
    imageLoader(imageIndex).then((src) => {
      if (!cancelled) setImageSrc(src);
    });
    return () => { cancelled = true; };
  }, [imageIndex, imageLoader]);

  const renderData: MoonPhaseRenderData = {
    phase,
    name,
    illumination,
    imageSrc,
    imageIndex,
  };

  // Render prop mode
  if (children) {
    return <>{children(renderData)}</>;
  }

  // Default rendering — show image once loaded
  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={alt ?? name}
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: '50%',
        display: 'block',
        ...style,
      }}
    />
  );
}

/** Derive phase name from a 0–1 value */
function getPhaseName(phase: number): MoonPhaseName {
  if (phase < 0.033) return 'New Moon';
  if (phase < 0.243) return 'Waxing Crescent';
  if (phase < 0.277) return 'First Quarter';
  if (phase < 0.493) return 'Waxing Gibbous';
  if (phase < 0.533) return 'Full Moon';
  if (phase < 0.743) return 'Waning Gibbous';
  if (phase < 0.777) return 'Last Quarter';
  return 'Waning Crescent';
}
