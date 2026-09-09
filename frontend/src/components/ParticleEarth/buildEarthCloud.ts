import {
  LAYER,
  fibonacciLonLat,
  lonLatToXYZ,
  pointInAnyPolygon,
  pointInPolygon,
  sampleGrid,
  type LayerId,
  type LonLat,
} from "./geo";
import {
  INDIA_BBOX,
  INDIA_OUTLINE,
  SRI_LANKA_BBOX,
  SRI_LANKA_OUTLINE,
  WORLD_LAND,
} from "./landPolygons";

export type PerformanceTier = "high" | "medium" | "low";

export interface EarthCloudOptions {
  tier?: PerformanceTier;
  includeSriLanka?: boolean;
  connectWorldLines?: boolean;
}

export interface EarthCloud {
  positions: Float32Array;
  layers: Uint8Array;
  /** Pair indices into positions (i0, i1, i0, i1, ...) */
  lineIndices: Uint32Array;
  counts: { shell: number; world: number; india: number; sriLanka: number; lines: number };
}

const TIER_CONFIG = {
  high: {
    shell: 2200,
    worldStep: 1.35,
    indiaStep: 0.28,
    sriStep: 0.22,
    edgeSamples: 90,
    maxNeighbors: 3,
    cellSize: 0.085,
    maxDist: 0.095,
    connectWorld: true,
    worldLineStride: 2,
  },
  medium: {
    shell: 1400,
    worldStep: 1.7,
    indiaStep: 0.38,
    sriStep: 0.3,
    edgeSamples: 70,
    maxNeighbors: 2,
    cellSize: 0.1,
    maxDist: 0.11,
    connectWorld: true,
    worldLineStride: 3,
  },
  low: {
    shell: 800,
    worldStep: 2.3,
    indiaStep: 0.5,
    sriStep: 0.4,
    edgeSamples: 48,
    maxNeighbors: 2,
    cellSize: 0.12,
    maxDist: 0.13,
    connectWorld: false,
    worldLineStride: 4,
  },
} as const;

function sampleRingEdges(ring: LonLat[], samples: number): LonLat[] {
  const out: LonLat[] = [];
  if (ring.length < 2) return out;
  const closed = [...ring];
  if (closed[0][0] !== closed[closed.length - 1][0] || closed[0][1] !== closed[closed.length - 1][1]) {
    closed.push(closed[0]);
  }

  let perimeter = 0;
  const segs: { a: LonLat; b: LonLat; len: number }[] = [];
  for (let i = 0; i < closed.length - 1; i++) {
    const a = closed[i];
    const b = closed[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len });
    perimeter += len;
  }
  if (perimeter < 1e-6) return out;

  for (let s = 0; s < samples; s++) {
    let t = (s / samples) * perimeter;
    for (const seg of segs) {
      if (t <= seg.len) {
        const u = seg.len > 0 ? t / seg.len : 0;
        out.push([seg.a[0] + (seg.b[0] - seg.a[0]) * u, seg.a[1] + (seg.b[1] - seg.a[1]) * u]);
        break;
      }
      t -= seg.len;
    }
  }
  return out;
}

function jitter(lon: number, lat: number, amount: number): LonLat {
  return [lon + (Math.random() - 0.5) * amount, lat + (Math.random() - 0.5) * amount];
}

function collectPoints(opts: Required<EarthCloudOptions>): {
  xyz: number[];
  layers: number[];
  counts: EarthCloud["counts"];
} {
  const cfg = TIER_CONFIG[opts.tier];
  const xyz: number[] = [];
  const layers: number[] = [];
  let shell = 0;
  let world = 0;
  let india = 0;
  let sriLanka = 0;

  const push = (lon: number, lat: number, layer: LayerId, radius = 1) => {
    const [x, y, z] = lonLatToXYZ(lon, lat, radius);
    xyz.push(x, y, z);
    layers.push(layer);
  };

  // 1) Sparse shell
  for (const [lon, lat] of fibonacciLonLat(cfg.shell)) {
    if (Math.abs(lat) > 82) continue;
    push(lon, lat, LAYER.SHELL, 1.002);
    shell++;
  }

  // 2) World landmasses (skip India bbox interiors - filled by India layer)
  for (const [lon0, lat0] of sampleGrid(-180, 180, -58, 78, cfg.worldStep)) {
    const [lon, lat] = jitter(lon0, lat0, cfg.worldStep * 0.35);
    if (lon >= INDIA_BBOX.west && lon <= INDIA_BBOX.east && lat >= INDIA_BBOX.south && lat <= INDIA_BBOX.north) {
      if (pointInPolygon(lon, lat, INDIA_OUTLINE)) continue;
    }
    if (!pointInAnyPolygon(lon, lat, WORLD_LAND)) continue;
    push(lon, lat, LAYER.WORLD, 1);
    world++;
  }

  // World coast edges (sparse)
  for (const ring of WORLD_LAND) {
    for (const [lon, lat] of sampleRingEdges(ring, Math.max(12, Math.floor(cfg.edgeSamples / 3)))) {
      if (lon >= INDIA_BBOX.west && lon <= INDIA_BBOX.east && lat >= INDIA_BBOX.south && lat <= INDIA_BBOX.north) {
        if (pointInPolygon(lon, lat, INDIA_OUTLINE)) continue;
      }
      push(...jitter(lon, lat, 0.15), LAYER.WORLD, 1);
      world++;
    }
  }

  // 3) India - denser fill + outline glow
  for (const [lon0, lat0] of sampleGrid(
    INDIA_BBOX.west,
    INDIA_BBOX.east,
    INDIA_BBOX.south,
    INDIA_BBOX.north,
    cfg.indiaStep
  )) {
    const [lon, lat] = jitter(lon0, lat0, cfg.indiaStep * 0.4);
    if (!pointInPolygon(lon, lat, INDIA_OUTLINE)) continue;
    push(lon, lat, LAYER.INDIA, 1.004);
    india++;
  }
  for (const [lon, lat] of sampleRingEdges(INDIA_OUTLINE, cfg.edgeSamples * 2)) {
    push(...jitter(lon, lat, 0.08), LAYER.INDIA, 1.006);
    india++;
  }
  // Second outline pass for thicker glow
  for (const [lon, lat] of sampleRingEdges(INDIA_OUTLINE, cfg.edgeSamples)) {
    push(...jitter(lon, lat, 0.18), LAYER.INDIA, 1.008);
    india++;
  }

  // 4) Optional Sri Lanka
  if (opts.includeSriLanka) {
    for (const [lon0, lat0] of sampleGrid(
      SRI_LANKA_BBOX.west,
      SRI_LANKA_BBOX.east,
      SRI_LANKA_BBOX.south,
      SRI_LANKA_BBOX.north,
      cfg.sriStep
    )) {
      const [lon, lat] = jitter(lon0, lat0, cfg.sriStep * 0.35);
      if (!pointInPolygon(lon, lat, SRI_LANKA_OUTLINE)) continue;
      push(lon, lat, LAYER.SRI_LANKA, 1.004);
      sriLanka++;
    }
    for (const [lon, lat] of sampleRingEdges(SRI_LANKA_OUTLINE, Math.floor(cfg.edgeSamples * 0.6))) {
      push(...jitter(lon, lat, 0.06), LAYER.SRI_LANKA, 1.006);
      sriLanka++;
    }
  }

  return { xyz, layers, counts: { shell, world, india, sriLanka, lines: 0 } };
}

/** Spatial-hash nearest-neighbor edges under a distance cap - O(n * k), not O(n²). */
function buildLines(
  positions: Float32Array,
  layers: Uint8Array,
  tier: PerformanceTier,
  connectWorld: boolean
): Uint32Array {
  const cfg = TIER_CONFIG[tier];
  const n = layers.length;
  const cellSize = cfg.cellSize;
  const maxDist = cfg.maxDist;
  const maxDistSq = maxDist * maxDist;
  const hash = new Map<string, number[]>();

  const keyOf = (x: number, y: number, z: number) => {
    const ix = Math.floor(x / cellSize);
    const iy = Math.floor(y / cellSize);
    const iz = Math.floor(z / cellSize);
    return `${ix},${iy},${iz}`;
  };

  const eligible: number[] = [];
  for (let i = 0; i < n; i++) {
    const layer = layers[i];
    if (layer === LAYER.SHELL) continue;
    if (layer === LAYER.WORLD && !connectWorld) continue;
    if (layer === LAYER.WORLD && i % cfg.worldLineStride !== 0) continue;
    eligible.push(i);
  }

  for (const i of eligible) {
    const i3 = i * 3;
    const k = keyOf(positions[i3], positions[i3 + 1], positions[i3 + 2]);
    let bucket = hash.get(k);
    if (!bucket) {
      bucket = [];
      hash.set(k, bucket);
    }
    bucket.push(i);
  }

  const pairs: number[] = [];
  const seen = new Set<string>();

  for (const i of eligible) {
    const i3 = i * 3;
    const x = positions[i3];
    const y = positions[i3 + 1];
    const z = positions[i3 + 2];
    const ix = Math.floor(x / cellSize);
    const iy = Math.floor(y / cellSize);
    const iz = Math.floor(z / cellSize);

    const candidates: { j: number; d: number }[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const bucket = hash.get(`${ix + dx},${iy + dy},${iz + dz}`);
          if (!bucket) continue;
          for (const j of bucket) {
            if (j <= i) continue;
            // Prefer same-layer connections; allow India↔nearby world lightly
            const li = layers[i];
            const lj = layers[j];
            if (li !== lj && !(li === LAYER.INDIA || lj === LAYER.INDIA)) continue;
            if (li === LAYER.WORLD && lj === LAYER.WORLD && (i + j) % cfg.worldLineStride !== 0) continue;

            const j3 = j * 3;
            const ddx = x - positions[j3];
            const ddy = y - positions[j3 + 1];
            const ddz = z - positions[j3 + 2];
            const d = ddx * ddx + ddy * ddy + ddz * ddz;
            if (d > maxDistSq || d < 1e-8) continue;
            candidates.push({ j, d });
          }
        }
      }
    }

    candidates.sort((a, b) => a.d - b.d);
    const limit = layers[i] === LAYER.INDIA ? cfg.maxNeighbors + 1 : cfg.maxNeighbors;
    for (let c = 0; c < Math.min(limit, candidates.length); c++) {
      const j = candidates[c].j;
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const id = `${a}-${b}`;
      if (seen.has(id)) continue;
      seen.add(id);
      pairs.push(a, b);
    }
  }

  return new Uint32Array(pairs);
}

let cache: Partial<Record<string, EarthCloud>> = {};

export function buildEarthCloud(options: EarthCloudOptions = {}): EarthCloud {
  const tier = options.tier ?? "high";
  const includeSriLanka = options.includeSriLanka ?? true;
  const connectWorldLines = options.connectWorldLines ?? TIER_CONFIG[tier].connectWorld;
  const key = `${tier}:${includeSriLanka}:${connectWorldLines}`;

  const hit = cache[key];
  if (hit) return hit;

  const { xyz, layers, counts } = collectPoints({ tier, includeSriLanka, connectWorldLines });
  const positions = new Float32Array(xyz);
  const layerArr = Uint8Array.from(layers);
  const lineIndices = buildLines(positions, layerArr, tier, connectWorldLines);
  counts.lines = lineIndices.length / 2;

  const cloud: EarthCloud = { positions, layers: layerArr, lineIndices, counts };
  cache[key] = cloud;
  return cloud;
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (mobile || cores <= 4 || (mem !== undefined && mem <= 4)) return "low";
  if (cores <= 6 || (mem !== undefined && mem <= 6)) return "medium";
  return "high";
}
