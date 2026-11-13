import { sources } from "../src/lib/data";

async function main() {
const concurrency = 6;
let cursor = 0;
const failures: Array<{ id: string; url: string; status: string }> = [];
let checked = 0;

async function checkSource(index: number) {
  const source = sources[index];
  if (!source) return;
  try {
    const response = await fetch(source.url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": "SPACE-RELICS-source-check/1.0" },
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 405 || response.status === 403) {
      const fallback = await fetch(source.url, {
        method: "GET",
        redirect: "follow",
        headers: { "user-agent": "SPACE-RELICS-source-check/1.0" },
        signal: AbortSignal.timeout(15_000),
      });
      if (!fallback.ok) {
        failures.push({
          id: source.id,
          url: source.url,
          status: String(fallback.status),
        });
      }
    } else if (!response.ok) {
      failures.push({
        id: source.id,
        url: source.url,
        status: String(response.status),
      });
    }
  } catch (error) {
    failures.push({
      id: source.id,
      url: source.url,
      status: error instanceof Error ? error.message.slice(0, 80) : "error",
    });
  } finally {
    checked += 1;
    if (checked % 10 === 0) {
      console.log(`checked ${checked}/${sources.length}`);
    }
  }
}

async function worker() {
  while (cursor < sources.length) {
    const index = cursor;
    cursor += 1;
    await checkSource(index);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (failures.length > 0) {
  console.error(`\n${failures.length} source link(s) failed:`);
  for (const failure of failures) {
    console.error(`- ${failure.id} [${failure.status}] ${failure.url}`);
  }
  process.exit(1);
}

console.log(`\nAll ${sources.length} source links responded successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
