import type { Metadata } from "next";
import { RexHub } from "@/components/rex/rex-hub";
import { rexChapters } from "@/data/rex/chapters";
import { fieldStudies } from "@/data/rex/field-studies";
import { getRelic } from "@/lib/data";

export const metadata: Metadata = {
  title: "The REX Expedition",
  description:
    "Join REX, AFTERLIGHT's fictional archaeological explorer, across five interactive chapters investigating humanity's physical legacy on the Moon and Mars.",
};

export default function RexPage() {
  const chapters = rexChapters.map((chapter) => ({
    slug: chapter.slug,
    order: chapter.order,
    title: chapter.title,
    subtitle: chapter.subtitle,
    summary: chapter.summary,
    scenes: chapter.scenes.length,
  }));

  const studies = fieldStudies.map((study) => {
    const relic = getRelic(study.relicId);
    return {
      slug: study.slug,
      relicId: study.relicId,
      title: study.title,
      subtitle: study.subtitle,
      scenes: study.scenes.length,
      destination: relic?.destination ?? "Moon",
      image: relic?.images[0].src ?? "",
      imageAlt: relic?.images[0].alt ?? "",
      status: relic?.operationalStatus ?? "unknown",
    };
  });

  return <RexHub chapters={chapters} studies={studies} />;
}
