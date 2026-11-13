import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { nasaImageRecords } from "../src/data/sources";

async function main() {
  const outputDir = join(process.cwd(), "public", "nasa");
  const manifestPath = join(outputDir, "source-manifest.json");
  const entries: Array<Record<string, unknown>> = [];
  const failures: Array<{ nasaId: string; error: string }> = [];

  for (const image of nasaImageRecords) {
    const url = `https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(image.nasaId)}`;
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "SPACE-RELICS-ingest/1.0" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = (await response.json()) as {
        collection?: {
          items?: Array<{
            data?: Array<{
              nasa_id?: string;
              title?: string;
              description?: string;
              center?: string;
              date_created?: string;
              photographer?: string;
              keywords?: string[];
            }>;
            href?: string;
          }>;
        };
      };
      const item = payload.collection?.items?.[0];
      const data = item?.data?.[0];
      if (!data) throw new Error("No item metadata");
      entries.push({
        schemaVersion: "1.0",
        assetType: "image",
        nasaId: image.nasaId,
        title: data.title ?? image.title,
        description: data.description ?? "",
        organization: data.center ?? image.credit,
        photographer: data.photographer ?? null,
        dateCreated: data.date_created ?? null,
        keywords: data.keywords ?? [],
        localPath: image.src,
        credit: image.credit,
        sourceUrl: `https://images.nasa.gov/details/${encodeURIComponent(image.nasaId)}`,
        apiRecord: item?.href ?? null,
        license: "NASA media guidelines / public domain unless noted",
        generated: false,
        normalizedAt: new Date().toISOString(),
      });
      console.log(`normalized ${image.nasaId}`);
    } catch (error) {
      failures.push({
        nasaId: image.nasaId,
        error: error instanceof Error ? error.message : "unknown error",
      });
      console.error(`failed ${image.nasaId}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "NASA Image and Video Library API",
        total: entries.length,
        failures,
        entries,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(
    `\nWrote ${entries.length} normalized image records to ${manifestPath}`,
  );
  if (failures.length > 0) {
    console.error(`${failures.length} image records failed metadata ingestion.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
