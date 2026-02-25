/** Moon phase names in cycle order (0 = New Moon) */
export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface MoonPhaseData {
  /** Phase fraction (0–1). 0 = New Moon, 0.5 = Full Moon */
  phase: number;
  /** Human-readable phase name */
  name: MoonPhaseName;
  /** Illumination fraction (0–1). 0 = fully dark, 1 = fully lit */
  illumination: number;
}

const SYNODIC_PERIOD = 29.53059;
const KNOWN_NEW_MOON_JD = 2451549.5; // Jan 6 2000 18:14 UTC

/**
 * Compute the Julian Day number for a given Date.
 */
function toJulianDay(date: Date): number {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;

  if (m < 3) {
    y--;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

/**
 * Get the phase name from a phase fraction (0–1).
 */
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

/**
 * Calculate moon phase data for a given date.
 * Uses the synodic period method relative to a known new moon (Jan 6, 2000).
 *
 * @param date - The date to calculate for. Defaults to now.
 * @returns Phase fraction, name, and illumination.
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const jd = toJulianDay(date);
  const daysSinceNew = jd - KNOWN_NEW_MOON_JD;
  const phase = ((daysSinceNew % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD / SYNODIC_PERIOD;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const name = getPhaseName(phase);
  return { phase, name, illumination };
}

/**
 * Map a phase fraction (0–1) to a moon image index (2–28).
 * There are 27 images spanning the full lunar cycle.
 */
export function getImageIndex(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  const idx = 2 + Math.round(p * 26);
  return idx > 28 ? 2 : idx;
}
