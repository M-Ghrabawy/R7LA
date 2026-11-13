import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/story/story-player";
import { fieldStudies, fieldStudiesByRelic } from "@/data/rex/field-studies";
import { getRelic } from "@/lib/data";

export function generateStaticParams() {
  return fieldStudies.map((study) => ({ id: study.relicId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const relic = getRelic(id);
  if (!relic) return { title: "Field study not found" };
  return {
    title: `REX Field Study — ${relic.shortName}`,
    description: `Join REX for a playable field study of ${relic.name}.`,
  };
}

export default async function RexFieldStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const relic = getRelic(id);
  const study = fieldStudiesByRelic.get(id);
  if (!relic || !study) notFound();

  return (
    <StoryPlayer
      progressId={study.slug}
      progressKind="study"
      title={study.title}
      subtitle={`REX field study / ${study.subtitle}`}
      objective="Investigate the object, reconstruct its sequence, and preserve its discovery log."
      scenes={study.scenes}
      backHref={`/relics/${relic.id}`}
      backLabel="Relic record"
      nextHref="/rex"
      nextLabel="Return to expedition hub"
      relicId={relic.id}
    />
  );
}
