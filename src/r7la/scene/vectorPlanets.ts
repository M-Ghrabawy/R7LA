import * as THREE from 'three';

/**
 * Flat vector-style planet art, matching the archive's illustrated
 * Explore-tab look: solid fills, crisp edges, no photographic noise.
 * Drawn at 1024x512 and cached per body.
 */

const cache = new Map<string, THREE.Texture>();

type Pt = [number, number];

function shape(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string, stroke?: string) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function disc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string,
) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function crater(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  dark = 'rgba(86, 82, 76, 0.55)',
  rim = 'rgba(244, 240, 232, 0.4)',
) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.92, 0, 0, Math.PI * 2);
  ctx.fillStyle = dark;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.92, 0, Math.PI * 1.05, Math.PI * 1.85);
  ctx.strokeStyle = rim;
  ctx.lineWidth = Math.max(1.5, r * 0.16);
  ctx.stroke();
}

/** A band whose top and bottom edges undulate like a vector illustration. */
function wavyBand(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  height: number,
  color: string,
  amplitude = 8,
  waves = 6,
) {
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let x = 0; x <= width; x += 8) {
    const dy = Math.sin((x / width) * Math.PI * 2 * waves) * amplitude;
    top.push([x, y + dy]);
    bottom.push([x, y + height + dy]);
  }
  ctx.beginPath();
  top.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  bottom.reverse().forEach(([px, py]) => ctx.lineTo(px, py));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function polarCap(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  top: boolean,
  color: string,
) {
  const edge = top ? height * 0.13 : height * 0.87;
  const pts: Pt[] = [];
  for (let x = 0; x <= width; x += 10) {
    const dy = Math.sin((x / width) * Math.PI * 6) * 10;
    pts.push([x, edge + (top ? dy : -dy)]);
  }
  if (top) {
    pts.push([width, 0], [0, 0]);
  } else {
    pts.push([width, height], [0, height]);
  }
  shape(ctx, pts, color);
}

export function getVectorPlanetTexture(
  body:
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'moon'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune'
    | 'ceres'
    | 'eros',
): THREE.Texture {
  const existing = cache.get(body);
  if (existing) return existing;

  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const X = (n: number) => n * w;
  const Y = (n: number) => n * h;

  const base = (color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  };

  switch (body) {
    case 'mercury': {
      base('#a19a90');
      disc(ctx, X(0.3), Y(0.36), 150, 110, '#8b857b');
      disc(ctx, X(0.68), Y(0.62), 120, 92, '#8f887e');
      disc(ctx, X(0.52), Y(0.72), 90, 64, '#877f75');
      for (let i = 0; i < 18; i++) {
        crater(ctx, Math.random() * w, Y(0.12) + Math.random() * Y(0.76), 10 + Math.random() * 34);
      }
      break;
    }
    case 'venus': {
      base('#ddc79f');
      wavyBand(ctx, w, Y(0.18), Y(0.09), '#c9ae82', 12, 5);
      wavyBand(ctx, w, Y(0.34), Y(0.12), '#efdcb8', 10, 4);
      wavyBand(ctx, w, Y(0.52), Y(0.08), '#c2a677', 12, 6);
      wavyBand(ctx, w, Y(0.66), Y(0.11), '#efdcb8', 9, 3);
      wavyBand(ctx, w, Y(0.8), Y(0.07), '#c9ae82', 8, 5);
      break;
    }
    case 'earth': {
      base('#36749a');
      // Ocean depth bands.
      wavyBand(ctx, w, Y(0.42), Y(0.16), '#2d6689', 6, 3);
      wavyBand(ctx, w, Y(0.62), Y(0.18), '#2a5f80', 6, 2);
      // Stylised landmasses, solid vector shapes.
      shape(ctx, [
        [X(0.08), Y(0.3)], [X(0.15), Y(0.22)], [X(0.24), Y(0.25)],
        [X(0.28), Y(0.33)], [X(0.23), Y(0.4)], [X(0.16), Y(0.43)],
        [X(0.1), Y(0.38)],
      ], '#93a96c', '#738550');
      shape(ctx, [
        [X(0.24), Y(0.47)], [X(0.3), Y(0.45)], [X(0.33), Y(0.58)],
        [X(0.3), Y(0.73)], [X(0.26), Y(0.62)], [X(0.23), Y(0.53)],
      ], '#8aa363', '#738550');
      shape(ctx, [
        [X(0.46), Y(0.3)], [X(0.56), Y(0.28)], [X(0.62), Y(0.36)],
        [X(0.6), Y(0.48)], [X(0.55), Y(0.62)], [X(0.49), Y(0.55)],
        [X(0.45), Y(0.42)],
      ], '#9cae72', '#738550');
      shape(ctx, [
        [X(0.62), Y(0.26)], [X(0.75), Y(0.23)], [X(0.86), Y(0.3)],
        [X(0.84), Y(0.4)], [X(0.73), Y(0.42)], [X(0.65), Y(0.36)],
      ], '#94aa6b', '#738550');
      shape(ctx, [
        [X(0.78), Y(0.58)], [X(0.87), Y(0.57)], [X(0.89), Y(0.66)],
        [X(0.83), Y(0.71)], [X(0.77), Y(0.66)],
      ], '#a3b077', '#738550');
      // Desert patches.
      disc(ctx, X(0.53), Y(0.38), 38, 26, '#c0a878');
      disc(ctx, X(0.72), Y(0.33), 44, 22, '#c2ab7c');
      disc(ctx, X(0.82), Y(0.64), 22, 14, '#c2ab7c');
      // Crisp cloud clusters.
      const cloud = (cx: number, cy: number, s: number) => {
        disc(ctx, cx, cy, 54 * s, 16 * s, 'rgba(242, 246, 247, 0.92)');
        disc(ctx, cx - 26 * s, cy + 5 * s, 30 * s, 12 * s, 'rgba(242, 246, 247, 0.92)');
        disc(ctx, cx + 30 * s, cy - 4 * s, 26 * s, 11 * s, 'rgba(242, 246, 247, 0.92)');
      };
      cloud(X(0.16), Y(0.5), 1);
      cloud(X(0.42), Y(0.2), 0.8);
      cloud(X(0.68), Y(0.55), 1.1);
      cloud(X(0.9), Y(0.42), 0.7);
      polarCap(ctx, w, h, true, 'rgba(240, 246, 248, 0.92)');
      polarCap(ctx, w, h, false, 'rgba(234, 242, 246, 0.9)');
      break;
    }
    case 'moon': {
      base('#bdb9af');
      disc(ctx, X(0.2), Y(0.34), 110, 74, '#a5a198');
      disc(ctx, X(0.38), Y(0.6), 130, 84, '#a19d94');
      disc(ctx, X(0.7), Y(0.4), 100, 68, '#a7a39a');
      disc(ctx, X(0.85), Y(0.68), 70, 46, '#a19d94');
      for (let i = 0; i < 20; i++) {
        crater(ctx, Math.random() * w, Y(0.1) + Math.random() * Y(0.8), 8 + Math.random() * 30);
      }
      break;
    }
    case 'mars': {
      base('#b06b4c');
      disc(ctx, X(0.22), Y(0.4), 120, 70, '#854c36');
      disc(ctx, X(0.5), Y(0.58), 150, 80, '#7d4732');
      disc(ctx, X(0.78), Y(0.36), 110, 62, '#8a5038');
      disc(ctx, X(0.62), Y(0.7), 80, 46, '#7d4732');
      // Valles Marineris-like slash.
      shape(ctx, [
        [X(0.3), Y(0.52)], [X(0.72), Y(0.5)], [X(0.72), Y(0.54)],
        [X(0.3), Y(0.56)],
      ], '#63382a');
      polarCap(ctx, w, h, true, 'rgba(240, 230, 218, 0.95)');
      polarCap(ctx, w, h, false, 'rgba(236, 226, 214, 0.95)');
      break;
    }
    case 'jupiter': {
      base('#d6c1a3');
      const bands: [number, number, string][] = [
        [0.08, 0.06, '#b89a78'], [0.17, 0.08, '#e6d3b8'], [0.28, 0.07, '#b39470'],
        [0.38, 0.09, '#e8d6bb'], [0.5, 0.06, '#c2a482'], [0.6, 0.09, '#e2cfb2'],
        [0.72, 0.06, '#b39470'], [0.82, 0.07, '#e6d3b8'], [0.9, 0.05, '#c2a482'],
      ];
      bands.forEach(([y, hh, c]) => wavyBand(ctx, w, Y(y), Y(hh), c, 7, 7));
      // Great Red Spot.
      disc(ctx, X(0.64), Y(0.64), 70, 34, '#b3664f');
      disc(ctx, X(0.64), Y(0.64), 46, 20, '#c47d62');
      disc(ctx, X(0.62), Y(0.63), 20, 9, '#a95a45');
      break;
    }
    case 'saturn': {
      base('#ddcaa4');
      [0.1, 0.2, 0.32, 0.44, 0.55, 0.66, 0.78, 0.88].forEach((p, i) =>
        wavyBand(ctx, w, Y(p), Y(0.06 + (i % 2) * 0.03), i % 2 ? '#efe0bd' : '#c3ac83', 6, 6),
      );
      break;
    }
    case 'uranus': {
      base('#a8d0d4');
      wavyBand(ctx, w, Y(0.32), Y(0.1), '#c0e2e5', 5, 4);
      wavyBand(ctx, w, Y(0.56), Y(0.12), '#96c2c8', 5, 5);
      break;
    }
    case 'neptune': {
      base('#5d84c0');
      wavyBand(ctx, w, Y(0.28), Y(0.08), '#7c9fd4', 6, 4);
      wavyBand(ctx, w, Y(0.5), Y(0.1), '#4c6fae', 6, 5);
      disc(ctx, X(0.36), Y(0.6), 54, 28, '#3f5f9a');
      disc(ctx, X(0.36), Y(0.6), 34, 16, '#4568a6');
      break;
    }
    case 'ceres': {
      base('#96918a');
      disc(ctx, X(0.34), Y(0.42), 120, 80, '#7f7a74');
      disc(ctx, X(0.62), Y(0.6), 90, 58, '#837e78');
      disc(ctx, X(0.43), Y(0.46), 16, 12, 'rgba(244, 240, 230, 0.9)');
      for (let i = 0; i < 12; i++) {
        crater(ctx, Math.random() * w, Y(0.1) + Math.random() * Y(0.8), 8 + Math.random() * 24);
      }
      break;
    }
    case 'eros': {
      base('#a48a6e');
      disc(ctx, X(0.28), Y(0.4), 130, 78, '#8c7358');
      disc(ctx, X(0.6), Y(0.62), 110, 66, '#8f765b');
      for (let i = 0; i < 10; i++) {
        crater(ctx, Math.random() * w, Y(0.12) + Math.random() * Y(0.76), 10 + Math.random() * 30);
      }
      break;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  cache.set(body, tex);
  return tex;
}
