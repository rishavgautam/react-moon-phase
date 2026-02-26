import React, { useState, useEffect, useRef, useMemo } from 'react';
import { loadMoonImage } from './imageLoader';
import type { MoonImageLoader } from './MoonPhase';

// Waxing half: indices 2 (new) through 15 (full) — light grows from right
const WAXING_INDICES = Array.from({ length: 14 }, (_, i) => i + 2); // 2–15

// For the "back" half of the rotation we reuse waxing frames 14→3 but
// mirror them horizontally. This makes the shadow sweep continuously in
// one direction instead of reversing, creating a true rotation illusion.
const MIRROR_INDICES = Array.from({ length: 12 }, (_, i) => 14 - i); // 14→3

export interface AnimatedMoonProps {
  /** Frames per second for the rotation animation. Default: 12 */
  fps?: number;
  /** Size in pixels. Default: 96 */
  size?: number;
  /** CSS class name applied to the image element. */
  className?: string;
  /** Inline styles applied to the image element. */
  style?: React.CSSProperties;
  /** Alt text for the moon image. Default: "Moon rotation" */
  alt?: string;
  /**
   * Custom image loader. Defaults to the built-in JPEG loader.
   * Use `loadMoonImageWebp` or `loadMoonImagePng` for other formats.
   */
  imageLoader?: MoonImageLoader;
}

interface Frame {
  src: string;
  mirrored: boolean;
}

/**
 * Displays an animated moon that cycles through phase images to create
 * a smooth rotation effect.
 *
 * The first half of the loop plays the waxing frames (new → full).
 * The second half replays the waxing frames in reverse, mirrored
 * horizontally, so the shadow sweeps continuously in one direction.
 *
 * @example
 * // Basic — rotating moon at 12 fps
 * <AnimatedMoon size={120} />
 *
 * @example
 * // Slow rotation with WebP images
 * import { loadMoonImageWebp } from 'react-moon-phase';
 * <AnimatedMoon fps={6} size={200} imageLoader={loadMoonImageWebp} />
 */
export function AnimatedMoon({
  fps = 12,
  size = 96,
  className,
  style,
  alt = 'Moon rotation',
  imageLoader = loadMoonImage,
}: AnimatedMoonProps) {
  const [images, setImages] = useState<Map<number, string> | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload the waxing images (2–15) — only these are needed
  useEffect(() => {
    let cancelled = false;

    Promise.all(WAXING_INDICES.map((i) => imageLoader(i))).then((loaded) => {
      if (cancelled) return;
      const map = new Map<number, string>();
      WAXING_INDICES.forEach((idx, j) => map.set(idx, loaded[j]));
      setImages(map);
    });

    return () => {
      cancelled = true;
    };
  }, [imageLoader]);

  // Build the frame sequence: waxing (2→15) + mirrored reverse (14→3)
  const frames: Frame[] = useMemo(() => {
    if (!images) return [];
    const seq: Frame[] = [];
    for (const idx of WAXING_INDICES) {
      seq.push({ src: images.get(idx)!, mirrored: false });
    }
    for (const idx of MIRROR_INDICES) {
      seq.push({ src: images.get(idx)!, mirrored: true });
    }
    return seq;
  }, [images]);

  // Run animation loop once frames are ready
  useEffect(() => {
    if (frames.length === 0) return;

    const interval = 1000 / fps;
    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frames, fps]);

  if (frames.length === 0) return null;

  const frame = frames[frameIndex];

  return (
    <img
      src={frame.src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: '50%',
        display: 'block',
        transform: frame.mirrored ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    />
  );
}
