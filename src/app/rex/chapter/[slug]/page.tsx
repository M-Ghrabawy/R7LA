import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPlayer } from "@/components/story/story-player";
import { chaptersBySlug, rexChapters } from "@/data/rex/chapters";

export function generateStaticParams() {
  return rexChapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chaptersBySlug.get(slug);
  if (!chapter) return { title: "Chapter not found" };
  return {
    title: `REX — ${chapter.title}`,
    description: chapter.summary,
  };
}

export default async function RexChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = chaptersBySlug.get(slug);
  if (!chapter) notFound();
  const next = rexChapters.find((item) => item.order === chapter.order + 1);

  return (
    <StoryPlayer
      progressId={chapter.slug}
      progressKind="chapter"
      title={chapter.title}
      subtitle={`REX expedition / chapter ${String(chapter.order).padStart(2, "0")}`}
      objective={chapter.objective}
      scenes={chapter.scenes}
      backHref="/rex"
      backLabel="Expedition hub"
      nextHref={next ? `/rex/chapter/${next.slug}` : "/explore"}
      nextLabel={next ? `Next chapter: ${next.title}` : "Return to the archive"}
    />
  );
}
