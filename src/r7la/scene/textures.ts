import * as THREE from 'three';

function hash2D(x: number, y: number, seed = 1337): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x: number, y: number, seed = 1337): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2D(ix, iy, seed);
  const b = hash2D(ix + 1, iy, seed);
  const c = hash2D(ix, iy + 1, seed);
  const d = hash2D(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number, seed = 1337, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * valueNoise(x * freq, y * freq, seed + i * 19);
    freq *= 2.02;
    amp *= 0.5;
  }
  return val;
}

const textureCache = new Map<string, THREE.Texture>();

function getOrCreate(key: string, builder: () => THREE.Texture): THREE.Texture {
  const existing = textureCache.get(key);
  if (existing) return existing;
  const tex = builder();
  textureCache.set(key, tex);
  return tex;
}

export function getPlanetTexture(
  body:
    | 'sun'
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
    | 'eros'
): THREE.Texture {
  return getOrCreate(`planet-${body}`, () => {
    const w = 1024;
    const h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(w, h);
    const data = img.data;

    for (let y = 0; y < h; y++) {
      const v = y / h;
      const lat = (v - 0.5) * Math.PI;
      for (let x = 0; x < w; x++) {
        const u = x / w;
        const idx = (y * w + x) * 4;
        const n1 = fbm(u * 8, v * 4, body.length * 91, 4);
        const n2 = fbm(u * 20, v * 10, body.length * 43 + 7, 3);

        let r = 128,
          g = 128,
          b = 128;

        switch (body) {
          case 'sun': {
            const gran = n1 * 0.65 + n2 * 0.35;
            r = Math.min(255, 245 + gran * 10);
            g = Math.min(255, 160 + gran * 85);
            b = Math.min(255, 55 + gran * 95);
            break;
          }
          case 'mercury': {
            const c = 105 + n1 * 70 + (n2 - 0.5) * 35;
            r = c * 1.02;
            g = c * 0.99;
            b = c * 0.94;
            break;
          }
          case 'venus': {
            const swirl = fbm(u * 6 + Math.sin(v * 8) * 0.4, v * 8, 22, 4);
            r = 195 + swirl * 45;
            g = 162 + swirl * 38;
            b = 112 + swirl * 28;
            break;
          }
          case 'earth': {
            const polar = Math.abs(v - 0.5) * 2;
            const land = n1 + (n2 - 0.5) * 0.35;
            const clouds = fbm(u * 7 + 1.5, v * 5 + 0.8, 999, 4);
            if (polar > 0.84 - n2 * 0.08) {
              r = 232;
              g = 238;
              b = 245;
            } else if (land > 0.53) {
              // Continents
              const arid = Math.max(0, 1 - Math.abs(polar - 0.32) * 3.5);
              r = 58 + arid * 95 + n2 * 25;
              g = 102 + arid * 32 + n2 * 20;
              b = 54 + arid * 12;
            } else {
              // Oceans
              const depth = Math.max(0, land * 1.6);
              r = 14 + depth * 18;
              g = 46 + depth * 45;
              b = 98 + depth * 55;
            }
            if (clouds > 0.58) {
              const alpha = Math.min(0.85, (clouds - 0.58) * 2.2);
              r = r * (1 - alpha) + 245 * alpha;
              g = g * (1 - alpha) + 248 * alpha;
              b = b * (1 - alpha) + 252 * alpha;
            }
            break;
          }
          case 'moon': {
            const mare = n1 < 0.44 ? 0.72 : 1.0;
            const base = (128 + n2 * 55) * mare;
            r = base;
            g = base * 0.99;
            b = base * 0.97;
            break;
          }
          case 'mars': {
            const polar = Math.abs(v - 0.5) * 2;
            if (polar > 0.91 - n2 * 0.04) {
              r = 228;
              g = 216;
              b = 205;
            } else {
              const darkRegion = n1 < 0.43 ? 0.76 : 1.0;
              r = (176 + n2 * 45) * darkRegion;
              g = (88 + n2 * 32) * darkRegion;
              b = (56 + n2 * 22) * darkRegion;
            }
            break;
          }
          case 'jupiter': {
            const band = Math.sin(v * 26 + n1 * 3.2) * 0.5 + 0.5;
            const fine = Math.cos(v * 52 + n2 * 4.0) * 0.5 + 0.5;
            r = 165 + band * 65 - fine * 18;
            g = 132 + band * 55 - fine * 12;
            b = 102 + band * 42;
            // Great Red Spot subtle ellipse
            const dx = (u - 0.62) * 3.8;
            const dy = (v - 0.63) * 8.5;
            const spotDist = Math.sqrt(dx * dx + dy * dy);
            if (spotDist < 0.28) {
              const blend = 1 - spotDist / 0.28;
              r = r * (1 - blend) + 198 * blend;
              g = g * (1 - blend) + 86 * blend;
              b = b * (1 - blend) + 58 * blend;
            }
            break;
          }
          case 'saturn': {
            const band = Math.sin(v * 20 + n1 * 1.4) * 0.5 + 0.5;
            r = 192 + band * 34;
            g = 172 + band * 30;
            b = 128 + band * 25;
            break;
          }
          case 'uranus': {
            const band = Math.sin(v * 10 + n1) * 0.5 + 0.5;
            r = 124 + band * 24;
            g = 192 + band * 22;
            b = 204 + band * 20;
            break;
          }
          case 'neptune': {
            const band = Math.sin(v * 14 + n1 * 2.2) * 0.5 + 0.5;
            r = 44 + band * 22;
            g = 86 + band * 36;
            b = 188 + band * 44;
            break;
          }
          case 'ceres': {
            const brightSpot = Math.hypot(u - 0.42, v - 0.45) < 0.028 ? 1.45 : 1.0;
            const base = Math.min(240, (92 + n1 * 48 + n2 * 22) * brightSpot);
            r = base * 0.98;
            g = base * 0.97;
            b = base * 0.95;
            break;
          }
          case 'eros': {
            const base = 112 + n1 * 44 + (n2 - 0.5) * 30;
            r = base * 1.06;
            g = base * 0.96;
            b = base * 0.86;
            break;
          }
        }

        // Subtle cratering for rocky bodies
        if (body === 'moon' || body === 'mercury' || body === 'ceres' || body === 'eros') {
          const craterNoise = Math.abs(n2 - 0.5);
          if (craterNoise < 0.04) {
            const shade = 0.85 + Math.cos(lat) * 0.08;
            r *= shade;
            g *= shade;
            b *= shade;
          }
        }

        data[idx] = Math.max(0, Math.min(255, r));
        data[idx + 1] = Math.max(0, Math.min(255, g));
        data[idx + 2] = Math.max(0, Math.min(255, b));
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 4;
    return tex;
  });
}

export function getPadGroundTexture(): THREE.Texture {
  return getOrCreate('pad-ground', () => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.5,
    );
    grad.addColorStop(0, 'rgba(22, 30, 40, 1)');
    grad.addColorStop(0.42, 'rgba(14, 21, 29, 0.98)');
    grad.addColorStop(0.7, 'rgba(8, 13, 19, 0.72)');
    grad.addColorStop(0.88, 'rgba(4, 8, 12, 0.34)');
    grad.addColorStop(1, 'rgba(2, 5, 8, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Fine aggregate speckle so the apron reads as concrete, not a flat disc.
    for (let i = 0; i < 16000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const d = Math.hypot(x - size / 2, y - size / 2) / (size / 2);
      if (d > 0.94) continue;
      const a = (1 - d) * 0.05 * Math.random();
      ctx.fillStyle =
        Math.random() > 0.5
          ? `rgba(148, 163, 184, ${a})`
          : `rgba(0, 0, 0, ${a * 1.4})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Expansion seams radiating from the pad.
    ctx.strokeStyle = 'rgba(2, 6, 10, 0.55)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(size / 2 + Math.cos(a) * size * 0.16, size / 2 + Math.sin(a) * size * 0.16);
      ctx.lineTo(size / 2 + Math.cos(a) * size * 0.46, size / 2 + Math.sin(a) * size * 0.46);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  });
}

export function getSaturnRingTexture(): THREE.Texture {
  return getOrCreate('saturn-ring', () => {
    const w = 512;
    const h = 32;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(w, h);

    for (let x = 0; x < w; x++) {
      const t = x / w;
      const cassini = t > 0.62 && t < 0.68 ? 0.08 : 1.0;
      const innerFade = Math.min(1, Math.max(0, (t - 0.06) * 8));
      const outerFade = Math.min(1, Math.max(0, (0.98 - t) * 10));
      const band = 0.65 + 0.35 * Math.sin(t * 95) * Math.cos(t * 37);
      const alpha = Math.floor(210 * cassini * innerFade * outerFade * band);
      const r = 205 + band * 25;
      const g = 188 + band * 22;
      const b = 152 + band * 20;

      for (let y = 0; y < h; y++) {
        const idx = (y * w + x) * 4;
        img.data[idx] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = alpha;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

export function getGoldFoilTexture(): { map: THREE.Texture; bumpMap: THREE.Texture } {
  const map = getOrCreate('gold-foil-map', () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = fbm(x * 0.08, y * 0.08, 701, 4);
        const crinkle = Math.abs(fbm(x * 0.18, y * 0.18, 912, 3) - 0.5) * 2;
        const idx = (y * size + x) * 4;
        img.data[idx] = Math.min(255, 200 + n * 48 - crinkle * 25);
        img.data[idx + 1] = Math.min(255, 148 + n * 42 - crinkle * 20);
        img.data[idx + 2] = Math.min(255, 38 + n * 24);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });

  const bumpMap = getOrCreate('gold-foil-bump', () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const crinkle = Math.abs(fbm(x * 0.16, y * 0.16, 912, 4) - 0.5) * 2;
        const v = Math.floor(crinkle * 255);
        const idx = (y * size + x) * 4;
        img.data[idx] = v;
        img.data[idx + 1] = v;
        img.data[idx + 2] = v;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });

  return { map, bumpMap };
}

export function getSolarPanelTexture(): THREE.Texture {
  return getOrCreate('solar-panel', () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0c1b36';
    ctx.fillRect(0, 0, size, size);

    // Cell grid
    ctx.strokeStyle = '#6088b8';
    ctx.lineWidth = 2;
    const cols = 8;
    const rows = 8;
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      const y = (j / rows) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    // Fine busbars
    ctx.strokeStyle = 'rgba(180, 210, 245, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < cols * 4; i++) {
      const x = (i / (cols * 4)) * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  });
}

export function getRadialGlowTexture(innerHex: string, outerHex = 'rgba(0,0,0,0)'): THREE.Texture {
  return getOrCreate(`glow-${innerHex}`, () => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      1,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, innerHex);
    grad.addColorStop(0.65, `${innerHex}44`);
    grad.addColorStop(1, outerHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

export function getRocketHullTexture(): THREE.Texture {
  return getOrCreate('rocket-hull', () => {
    const w = 512;
    const h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Base metallic aerospace white-silver skin
    ctx.fillStyle = '#e7edf5';
    ctx.fillRect(0, 0, w, h);

    // Subtle panel shading bands
    for (let y = 0; y < h; y += 64) {
      ctx.fillStyle = (y / 64) % 2 === 0 ? 'rgba(203, 213, 225, 0.28)' : 'rgba(255, 255, 255, 0.16)';
      ctx.fillRect(0, y, w, 64);
    }

    // Precision circumferential & vertical weld seams
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.42)';
    ctx.lineWidth = 2;
    for (let y = 0; y <= h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 0; x <= w; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Black roll-pattern band near top interstage
    ctx.fillStyle = '#181e29';
    ctx.fillRect(0, 24, w * 0.25, 40);
    ctx.fillRect(w * 0.5, 24, w * 0.25, 40);

    // Aerospace stringer ribs
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
    ctx.lineWidth = 1;
    for (let x = 16; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 64);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Crisp vertical R7LA stencil mark
    ctx.save();
    ctx.translate(w * 0.25, h * 0.52);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('R7LA', 0, 0);
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(-28, 12, 56, 4);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = 4;
    return tex;
  });
}

export function getEchoBadgeTexture(): THREE.Texture {
  return getOrCreate('echo-r7la-badge', () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Dark glossy emblem disc
    ctx.fillStyle = '#090f1c';
    ctx.fillRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 116, 0, Math.PI * 2);
    ctx.fillStyle = '#070b14';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Cyan dot above inverted triangle (matching reference image_0d8357d4.png)
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(size / 2, 68, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(size / 2 - 22, 84);
    ctx.lineTo(size / 2 + 22, 84);
    ctx.lineTo(size / 2, 118);
    ctx.closePath();
    ctx.fill();

    // Crisp R7LA wordmark
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('R 7 L A', size / 2, 162);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  });
}
