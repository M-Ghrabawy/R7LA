import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT || 4000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, clean);
  try {
    const info = await stat(file);
    if (info.isDirectory()) return join(file, "index.html");
    return file;
  } catch {
    try {
      const withSlash = await stat(join(root, clean, "index.html"));
      if (withSlash.isFile()) return join(root, clean, "index.html");
    } catch {}
    try {
      const html = await stat(`${file}.html`);
      if (html.isFile()) return `${file}.html`;
    } catch {}
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const file = await resolveFile(url.pathname);
  if (!file) {
    try {
      const body = await readFile(join(root, "404.html"));
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(500).end("Read error");
  }
}).listen(port, () => {
  console.log(`Static export served at http://localhost:${port}`);
});
