/** Layer IDs for particle cloud */
export const LAYER = {
  SHELL: 0,
  WORLD: 1,
  INDIA: 2,
  SRI_LANKA: 3,
} as const;

export type LayerId = (typeof LAYER)[keyof typeof LAYER];

export type LonLat = [number, number];

/** Convert geographic lon/lat (degrees) to unit-sphere XYZ. */
export function lonLatToXYZ(lon: number, lat: number, radius = 1): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

/** Ray-cast point-in-polygon for lon/lat rings (closed or open). */
export function pointInPolygon(lon: number, lat: number, ring: LonLat[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function pointInAnyPolygon(lon: number, lat: number, polys: LonLat[][]): boolean {
  for (const ring of polys) {
    if (pointInPolygon(lon, lat, ring)) return true;
  }
  return false;
}

/** Fibonacci sphere sample → lon/lat. */
export function fibonacciLonLat(n: number): LonLat[] {
  const out: LonLat[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const lat = (Math.asin(y) * 180) / Math.PI;
    let lon = (Math.atan2(z, -x) * 180) / Math.PI;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    out.push([lon, lat]);
  }
  return out;
}

/** Even lon/lat grid sample within a bounding box. */
export function sampleGrid(
  west: number,
  east: number,
  south: number,
  north: number,
  step: number
): LonLat[] {
  const out: LonLat[] = [];
  for (let lat = south; lat <= north; lat += step) {
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const lonStep = step / Math.max(0.35, cosLat);
    for (let lon = west; lon <= east; lon += lonStep) {
      out.push([lon, lat]);
    }
  }
  return out;
}
