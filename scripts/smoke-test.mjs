const base = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/explore",
  "/catalog",
  "/timeline",
  "/evidence",
  "/legacy",
  "/archaeologist",
  "/about",
  "/rex",
  "/rex/chapter/the-departure",
  "/rex/chapter/silent-footprints",
  "/rex/chapter/the-forgotten-journey",
  "/rex/chapter/what-remains",
  "/rex/chapter/a-message-to-tomorrow",
  "/rex/relic/apollo-11-lunar-module",
  "/rex/relic/apollo-11-laser-ranging-retroreflector",
  "/rex/relic/apollo-12-lunar-module",
  "/rex/relic/apollo-15-lunar-roving-vehicle",
  "/rex/relic/apollo-17-lunar-module",
  "/rex/relic/lunokhod-1",
  "/rex/relic/surveyor-3",
  "/rex/relic/sojourner",
  "/rex/relic/spirit",
  "/rex/relic/opportunity",
  "/rex/relic/curiosity",
  "/rex/relic/perseverance",
  "/rex/relic/mars-pathfinder",
  "/rex/relic/viking-1",
  "/relics/apollo-11-lunar-module",
  "/relics/apollo-11-laser-ranging-retroreflector",
  "/relics/apollo-12-lunar-module",
  "/relics/apollo-15-lunar-roving-vehicle",
  "/relics/apollo-17-lunar-module",
  "/relics/lunokhod-1",
  "/relics/surveyor-3",
  "/relics/sojourner",
  "/relics/spirit",
  "/relics/opportunity",
  "/relics/curiosity",
  "/relics/perseverance",
  "/relics/mars-pathfinder",
  "/relics/viking-1",
  "/api/health",
];

let failures = 0;

for (const route of routes) {
  try {
    const response = await fetch(`${base}${route}`, {
      redirect: "follow",
      headers: { "user-agent": "space-relics-smoke-test" },
    });
    if (response.status !== 200) {
      failures += 1;
      console.error(`FAIL ${response.status} ${route}`);
    } else {
      console.log(`OK   ${response.status} ${route}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${route}: ${error.message}`);
  }
}

try {
  const response = await fetch(`${base}/api/assistant`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: "Why was this object left behind?",
      relicId: "apollo-11-lunar-module",
      level: "archivist",
      history: [],
    }),
  });
  const data = await response.json();
  if (response.ok && data.mode === "demo" && data.citations?.length > 0) {
    console.log("OK   200 /api/assistant demo response");
  } else {
    failures += 1;
    console.error(
      `FAIL /api/assistant: ${response.status} ${JSON.stringify(data).slice(0, 240)}`,
    );
  }
} catch (error) {
  failures += 1;
  console.error(`FAIL /api/assistant: ${error.message}`);
}

if (failures > 0) {
  console.error(`\n${failures} smoke test(s) failed.`);
  process.exit(1);
}

console.log("\nAll SPACE RELICS smoke tests passed.");
