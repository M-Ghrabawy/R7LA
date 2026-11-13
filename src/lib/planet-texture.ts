function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPlanetTexture(
  kind: "Moon" | "Mars",
): HTMLCanvasElement {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const random = mulberry32(kind === "Moon" ? 19690720 : 19970704);
  const isMoon = kind === "Moon";

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (isMoon) {
    gradient.addColorStop(0, "#8e9290");
    gradient.addColorStop(0.45, "#b8bbb7");
    gradient.addColorStop(0.7, "#8b908e");
    gradient.addColorStop(1, "#a5a8a3");
  } else {
    gradient.addColorStop(0, "#9a4b32");
    gradient.addColorStop(0.38, "#c06a42");
    gradient.addColorStop(0.64, "#8f402d");
    gradient.addColorStop(1, "#b15b39");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (isMoon) {
    for (let i = 0; i < 12; i += 1) {
      const x = random() * width;
      const y = 40 + random() * (height - 80);
      const rx = 50 + random() * 180;
      const ry = 24 + random() * 90;
      const maria = ctx.createRadialGradient(x, y, 0, x, y, rx);
      maria.addColorStop(0, "rgba(48, 54, 55, .34)");
      maria.addColorStop(0.7, "rgba(58, 64, 64, .18)");
      maria.addColorStop(1, "rgba(58, 64, 64, 0)");
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, ry / rx);
      ctx.fillStyle = maria;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    const cap = ctx.createLinearGradient(0, 0, 0, 44);
    cap.addColorStop(0, "rgba(238, 229, 215, .85)");
    cap.addColorStop(1, "rgba(238, 229, 215, 0)");
    ctx.fillStyle = cap;
    ctx.fillRect(0, 0, width, 44);
    const southCap = ctx.createLinearGradient(0, height, 0, height - 32);
    southCap.addColorStop(0, "rgba(238, 229, 215, .72)");
    southCap.addColorStop(1, "rgba(238, 229, 215, 0)");
    ctx.fillStyle = southCap;
    ctx.fillRect(0, height - 32, width, 32);

    for (let i = 0; i < 9; i += 1) {
      const x = random() * width;
      const y = 70 + random() * (height - 140);
      ctx.strokeStyle = "rgba(74, 35, 27, .3)";
      ctx.lineWidth = 1 + random() * 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let point = 0; point < 7; point += 1) {
        ctx.lineTo(
          x + point * 28 + random() * 40,
          y + (random() - 0.5) * 44,
        );
      }
      ctx.stroke();
    }
  }

  const craterCount = isMoon ? 180 : 60;
  for (let i = 0; i < craterCount; i += 1) {
    const x = random() * width;
    const y = 24 + random() * (height - 48);
    const radius = (isMoon ? 1.2 : 2) + random() * (isMoon ? 12 : 7);
    const shade = isMoon ? 0.28 : 0.34;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(40, 38, 34, ${shade * random()})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      x - radius * 0.25,
      y - radius * 0.25,
      radius * 0.82,
      0,
      Math.PI * 2,
    );
    ctx.strokeStyle = `rgba(246, 238, 219, ${0.08 + random() * 0.11})`;
    ctx.lineWidth = Math.max(0.4, radius * 0.12);
    ctx.stroke();
  }

  const noise = ctx.getImageData(0, 0, width, height);
  const data = noise.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (random() - 0.5) * (isMoon ? 13 : 10);
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(noise, 0, 0);

  return canvas;
}
