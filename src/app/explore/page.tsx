import type { Metadata } from "next";
import { Suspense } from "react";
import { ExplorerExperience } from "@/components/explore/explorer-experience";
import { SceneLoading } from "@/components/three/scene-loader";
import {
  archiveStats,
  computeLegacyTotal,
  relics,
} from "@/lib/data";
import { toSceneRelic } from "@/lib/scene-types";
import type { Destination } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Planet Explorer",
  description:
    "Explore human artifacts on the Moon and Mars by location, mission, category, and operational status.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ world?: string; relic?: string }>;
}) {
  const params = await searchParams;
  const world: Destination =
    params.world?.toLowerCase() === "mars" ? "Mars" : "Moon";
  const sceneRelics = relics.map((relic) =>
    toSceneRelic(relic, computeLegacyTotal(relic.legacy)),
  );

  return (
    <Suspense fallback={<SceneLoading className="min-h-[70svh]" />}>
      <ExplorerExperience
        relics={sceneRelics}
        initialWorld={world}
        initialRelicId={params.relic ?? null}
        stats={{
          relics: archiveStats.relics,
          sources: archiveStats.identifiedSources,
        }}
      />
    </Suspense>
  );
}
