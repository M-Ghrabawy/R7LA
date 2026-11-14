import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  MapPin,
  Orbit,
  Radio,
} from "lucide-react";
import { extendedCatalog } from "@/data/extended-catalog";
import { observatoryHrefForExtended } from "@/r7la/bridge";

export function generateStaticParams() {
  return extendedCatalog.map((object) => ({ id: object.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const object = extendedCatalog.find((item) => item.id === id);
  if (!object) return { title: "Catalogue record not found" };
  const title = object.name
    .toLowerCase()
    .includes(object.mission.toLowerCase())
    ? object.name
    : `${object.name} — ${object.mission}`;
  return {
    title,
    description: object.summary,
  };
}

const kindLabel = {
  photograph: "Historical photograph",
  "artist-concept": "Artist concept",
  data: "Data visualisation",
} as const;

export default async function ExtendedRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const object = extendedCatalog.find((item) => item.id === id);
  if (!object) notFound();

  const observatoryHref = observatoryHrefForExtended(object.id);

  return (
    <article>
      <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
            <Link href="/" className="hover:text-gold">
              Observatory
            </Link>
            <span className="text-muted/40">/</span>
            <Link href="/catalog" className="hover:text-gold">
              Extended catalogue
            </Link>
            <span className="text-muted/40">/</span>
            <span className="text-silver">{object.mission}</span>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-teal-bright">
            Catalogue record
          </span>
        </div>

        <header className="grid gap-8 py-8 lg:grid-cols-12 lg:items-end lg:py-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-gold/40 bg-gold/[0.04] px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
                {object.destination} / {object.group}
              </span>
              <span className="border border-line px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/75">
                {object.operationalStatus}
              </span>
            </div>
            <h1 className="mt-6 text-balance text-[clamp(2.6rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.05em] text-white">
              {object.name}
            </h1>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.17em] text-muted">
              {object.mission} · {object.dateLabel}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-silver/70 md:text-base md:leading-8">
              {object.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {observatoryHref && (
                <Link
                  href={observatoryHref}
                  className="inline-flex items-center gap-3 border border-teal-bright/60 bg-teal/10 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-teal-bright transition-colors hover:border-gold hover:text-gold"
                >
                  <Orbit className="size-3.5" />
                  Open 3D scan
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
              <Link
                href="/catalog"
                className="inline-flex items-center gap-3 border border-line px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-silver transition-colors hover:border-teal-bright hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                All catalogue records
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden border border-line">
              <Image
                src={object.image.src}
                alt={object.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/70">
                    {kindLabel[object.image.kind]}
                  </p>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-silver/60">
                    {object.image.credit}
                  </p>
                </div>
                <a
                  href={object.image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-white/20 bg-abyss/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-silver transition-colors hover:border-gold hover:text-gold"
                >
                  NASA record
                  <ArrowUpRight className="size-2.5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-px border border-line/70 bg-line/50 md:grid-cols-4">
          <Datum icon={<MapPin />} label="Location" value={object.location} />
          <Datum
            icon={<CalendarClock />}
            label="Date"
            value={object.dateLabel}
          />
          <Datum
            icon={<Radio />}
            label="Operational state"
            value={object.operationalStatus}
          />
          <Datum
            icon={<Orbit />}
            label="Physical state"
            value={object.physicalStatus}
            accent
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-white md:text-3xl">
              Why it matters.
            </h2>
            <p className="article-prose mt-5 max-w-2xl text-sm leading-7 text-silver/75 md:text-base md:leading-8">
              {object.significance}
            </p>
            {object.endLabel && (
              <p className="mt-6 border-l border-gold/50 pl-4 font-mono text-[9px] uppercase leading-5 tracking-[0.14em] text-gold/80">
                {object.endLabel}
              </p>
            )}
          </div>
          <div className="lg:col-span-5">
            <p className="technical-label">Sources</p>
            <ul className="mt-4 space-y-2">
              {object.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 border border-line/60 px-3 py-2.5 text-xs text-silver/80 transition-colors hover:border-teal/50 hover:text-white"
                  >
                    <span>
                      {source.title}
                      <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                        {source.organization}
                      </span>
                    </span>
                    <ArrowUpRight className="size-3 shrink-0 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function Datum({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-panel/60 p-4">
      <span className={accent ? "text-gold [&_svg]:size-3.5" : "text-teal [&_svg]:size-3.5"}>
        {icon}
      </span>
      <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-silver/80">{value}</p>
    </div>
  );
}
