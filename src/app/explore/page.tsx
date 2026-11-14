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

export const metadata: Metadata = {
  title: "Planet Explorer",
  description:
    "Explore human artifacts on the Moon and Mars by location, mission, category, and operational status.",
};

export default function ExplorePage() {
  const sceneRelics = relics.map((relic) =>
    toSceneRelic(relic, computeLegacyTotal(relic.legacy)),
  );

  return (
    <Suspense fallback={<SceneLoading className="min-h-[70svh]" />}>
      <ExplorerExperience
        relics={sceneRelics}
        initialWorld="Moon"
        initialRelicId={null}
        stats={{
          relics: archiveStats.relics,
          sources: archiveStats.identifiedSources,
        }}
      />
    </Suspense>
  );
}
