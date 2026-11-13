import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  MapPin,
  Orbit,
  Radio,
  ScanSearch,
} from "lucide-react";
import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { LifetimeComparison } from "@/components/relic/lifetime-comparison";
import { LegacyScorePanel } from "@/components/relic/legacy-score-panel";
import { TimelineList } from "@/components/relic/timeline-list";
import { EvidencePanel } from "@/components/relic/evidence-panel";
import { RelicCard } from "@/components/shared/relic-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  OperationalBadge,
  PhysicalBadge,
} from "@/components/shared/status-badge";
import { SourceLinks, InlineSources } from "@/components/shared/source-list";
import { AIArtworkDisclosure } from "@/components/shared/disclosures";
import { SchematicViewer } from "@/components/three/schematic-viewer";
import { liveProviderConfigured } from "@/lib/ai";
import {
  computeLegacyTotal,
  formatCoordinate,
  formatDate,
  getRelic,
  getSource,
  relics,
  sortRelicsByLegacy,
} from "@/lib/data";

export function generateStaticParams() {
  return relics.map((relic) => ({ id: relic.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const relic = getRelic(id);
  if (!relic) return { title: "Relic not found" };
  return {
    title: `${relic.shortName} — ${relic.mission}`,
    description: relic.description,
    openGraph: {
      title: `${relic.shortName} · SPACE RELICS`,
      description: relic.description,
      images: [{ url: relic.images[0].src, alt: relic.images[0].alt }],
    },
  };
}

const precisionLabels = {
  exact: "Exact · sourced coordinates",
  approximate: "Approximate · sourced coordinates",
  "landing-ellipse": "Landing region · not an exact point",
};

export default async function RelicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const relic = getRelic(id);
  if (!relic) notFound();

  const heroImage = relic.images[0];
  const heroSource = getSource(heroImage.sourceId);
  const imageSources = relic.sources.filter(
    (source) => source.category === "imagery",
  );
  const referenceSources = relic.sources.filter(
    (source) => source.category !== "imagery",
  );
  const related = sortRelicsByLegacy(
    relics.filter(
      (item) => item.destination === relic.destination && item.id !== relic.id,
    ),
  ).slice(0, 3);
  const liveConfigured = liveProviderConfigured();
  const editorScore = computeLegacyTotal(relic.legacy);
  const imageSourceFor = (sourceId: string) => getSource(sourceId);

  return (
    <article>
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
            <Link href="/" className="hover:text-gold">
              Observatory
            </Link>
            <span className="text-muted/40">/</span>
            <Link href="/explore" className="hover:text-gold">
              Explorer
            </Link>
            <span className="text-muted/40">/</span>
            <Link
              href={`/explore?world=${relic.destination}`}
              className="hover:text-gold"
            >
              {relic.destination}
            </Link>
            <span className="text-muted/40">/</span>
            <span className="text-silver">{relic.missionShort}</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            <span>Record {relic.id.slice(0, 14).toUpperCase()}</span>
            <span className="h-3 w-px bg-line" />
            <span className="text-teal-bright">Sources reviewed</span>
          </div>
        </div>

        <header className="grid gap-8 py-8 lg:grid-cols-12 lg:items-end lg:py-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-gold/40 bg-gold/[0.04] px-2 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
                {relic.destination} / {relic.category}
              </span>
              <OperationalBadge status={relic.operationalStatus} />
            </div>
            <h1 className="mt-6 text-balance text-[clamp(2.7rem,5.2vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white">
              {relic.shortName}
            </h1>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.17em] text-muted">
              {relic.mission} · landed {formatDate(relic.landingDate)} ·{" "}
              {relic.destination}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-silver/70 md:text-base md:leading-8">
              {relic.description}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden border border-line">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/70">
                    Historical photograph
                  </p>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-silver/60">
                    {heroImage.credit}
                  </p>
                </div>
                {heroSource && (
                  <a
                    href={heroSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-white/20 bg-abyss/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-silver transition-colors hover:border-gold hover:text-gold"
                  >
                    NASA record
                    <ArrowUpRight className="size-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-px border border-line/70 bg-line/50 md:grid-cols-4">
          <HeroDatum
            icon={<MapPin />}
            label="Coordinates"
            value={formatCoordinate(
              relic.coordinates.latitude,
              relic.coordinates.longitude,
            )}
            mono
          />
          <HeroDatum
            icon={<CalendarClock />}
            label="Landing date"
            value={formatDate(relic.landingDate)}
          />
          <HeroDatum
            icon={<Orbit />}
            label="Operational state"
            value={relic.operationalStatus.replaceAll("-", " ")}
          />
          <HeroDatum
            icon={<Radio />}
            label="Editorial legacy"
            value={`${editorScore} / 100`}
            accent
          />
        </div>
      </div>

      <section className="border-y border-line/60 bg-void/30">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionHeading
                index="01"
                label="Mission record"
                title="What it was, and what it did."
              />

              <div className="mt-8 space-y-10">
                <RecordBlock
                  title="Original purpose"
                  icon={<ScanSearch />}
                  statements={relic.purpose}
                />
                <RecordBlock
                  title="Operational history"
                  icon={<Radio />}
                  statements={relic.operationalHistory}
                />
                <RecordBlock
                  title="Scientific legacy"
                  icon={<Orbit />}
                  statements={relic.scientificLegacy}
                />
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 border border-line/80 bg-panel/30">
                <div className="border-b border-line/60 px-5 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
                    Technical panel
                  </p>
                </div>
                <dl className="divide-y divide-line/50 px-5">
                  <DataField label="Mission" value={relic.mission} />
                  <DataField label="Destination" value={relic.destination} />
                  <DataField label="Category" value={relic.category} />
                  <DataField
                    label="Landing date"
                    value={formatDate(relic.landingDate)}
                    mono
                  />
                  <DataField
                    label="Mission completion"
                    value={relic.endDate ? formatDate(relic.endDate) : "No end date recorded"}
                    mono
                  />
                  <DataField
                    label="Original function"
                    value={relic.originalFunction}
                  />
                  <DataField label="Current condition" value={relic.currentCondition} />
                  <DataField
                    label="Location"
                    value={relic.coordinates.label}
                  />
                  <DataField
                    label="Position precision"
                    value={precisionLabels[relic.coordinates.precision]}
                  />
                </dl>
                <div className="space-y-2 border-t border-line/60 p-4">
                  <OperationalBadge status={relic.operationalStatus} />
                  <PhysicalBadge status={relic.physicalStatus} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <SectionHeading
          index="02"
          label="Lifetime study"
          title="Planned life versus the record."
          description="A direct comparison using the archive's stated values and units. Missing data remains missing; no figure is inferred."
        />
        <div className="mt-8">
          <LifetimeComparison
            planned={relic.plannedLifetime}
            actual={relic.actualLifetime}
            basis={relic.lifetimeBasis}
          />
        </div>
      </section>

      <section className="border-y border-line/60 bg-void/30">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                index="03"
                label="Object study"
                title="Schematic view."
                description="Interactive AFTERLIGHT reconstruction. It communicates form and function, not flight configuration or measured geometry."
              />
              <div className="mt-8">
                <SchematicViewer category={relic.category} />
                <AIArtworkDisclosure className="mt-2" />
              </div>
            </div>

            <div>
              <SectionHeading
                index="04"
                label="Historical photography"
                title="The visual record."
                description="Official NASA imagery, linked to its original image-library record with attribution."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {relic.images.map((image) => {
                  const source = imageSourceFor(image.sourceId);
                  return (
                    <figure
                      key={image.id}
                      className="group border border-line/70 bg-panel/25"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 to-transparent" />
                        <span className="absolute left-2 top-2 border border-line/70 bg-abyss/80 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.12em] text-silver">
                          NASA
                        </span>
                      </div>
                      <figcaption className="p-3">
                        <p className="text-[11px] leading-5 text-silver/80">
                          {image.title}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
                            {image.credit}
                          </span>
                          {source && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-mono text-[6px] uppercase tracking-[0.1em] text-teal-bright hover:text-gold"
                            >
                              Source
                              <ArrowUpRight className="size-2.5" />
                            </a>
                          )}
                        </div>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              index="05"
              label="Chronology"
              title="Mission timeline."
            />
            <div className="mt-8">
              <TimelineList events={relic.timeline} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <SectionHeading
              index="06"
              label="Evidence chain"
              title="What is known."
              description="Verified records, scientific interpretations, and hypothetical scenarios are separated."
            />
            <EvidencePanel claims={relic.claims} className="mt-8" />
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-void/30">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              index="07"
              label="Legacy assessment"
              title="A measured editorial view."
              description="Five dimensions, explained. Adjustable weights and full methodology are available in the Legacy section."
            />
            <Link
              href="/legacy"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-teal-bright transition-colors hover:text-gold"
            >
              Open legacy comparison
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="lg:col-span-7">
            <LegacyScorePanel assessment={relic.legacy} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              index="08"
              label="AI archaeologist"
              title="Interrogate the record."
              description="Ask this object about its purpose, end of mission, science, condition, or future. Answers are grounded in the sources shown on this page."
            />
            <div className="mt-6 border border-line/60 bg-panel/20 p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                Object context
              </p>
              <p className="mt-2 text-sm text-silver">{relic.name}</p>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                {relic.mission} · {relic.destination} ·{" "}
                {relic.operationalStatus.replaceAll("-", " ")}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {relic.claims.slice(0, 3).map((claim) => (
                  <span
                    key={claim.id}
                    className="border border-line/50 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-muted"
                  >
                    {claim.status}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <AssistantPanel
              artifacts={[
                {
                  id: relic.id,
                  shortName: relic.shortName,
                  missionShort: relic.missionShort,
                  destination: relic.destination,
                  category: relic.category,
                },
              ]}
              fixedRelicId={relic.id}
              liveConfigured={liveConfigured}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line/60 bg-void/40">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <SectionHeading
            index="09"
            label="Reference record"
            title="Sources and attribution."
            description="Mission records, coordinate references, historical material, and NASA image-library entries used to build this investigation."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                Primary and technical records
              </p>
              <SourceLinks sourceIds={referenceSources.map((source) => source.id)} />
            </div>
            <div>
              <p className="mb-3 font-mono text-[8px] uppercase tracking-[0.16em] text-teal-bright">
                NASA imagery records
              </p>
              <SourceLinks sourceIds={imageSources.map((source) => source.id)} />
            </div>
          </div>
          <p className="mt-6 max-w-3xl font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted/60">
            NASA imagery is generally not protected by copyright in the United
            States. Attribution is provided for every image. No NASA logo,
            insignia, or endorsement is used. Editorial assessments are original
            to AFTERLIGHT.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex items-center gap-2 border border-line-bright px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-silver transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="size-3.5" />
            Return to planet explorer
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
          <SectionHeading
            index="10"
            label="Same world"
            title="Continue the investigation."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item, index) => (
              <RelicCard
                key={item.id}
                relic={item}
                index={`R-${String(index + 1).padStart(2, "0")}`}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function HeroDatum({
  icon,
  label,
  value,
  mono = false,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="bg-abyss p-4">
      <div className="flex items-center gap-2 text-teal">
        <span className="[&_svg]:size-3">{icon}</span>
        <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
          {label}
        </span>
      </div>
      <p
        className={`mt-2 truncate font-mono text-[11px] uppercase ${accent ? "text-gold" : "text-silver"}`}
      >
        {value}
      </p>
      {mono && <span className="sr-only">coordinates</span>}
    </div>
  );
}

function RecordBlock({
  title,
  icon,
  statements,
}: {
  title: string;
  icon: React.ReactNode;
  statements: { text: string; sourceIds: string[]; status: string }[];
}) {
  return (
    <div className="border-t border-line/60 pt-5">
      <div className="flex items-center gap-2 text-gold">
        <span className="[&_svg]:size-3.5">{icon}</span>
        <h3 className="font-mono text-[9px] uppercase tracking-[0.16em]">
          {title}
        </h3>
      </div>
      <div className="mt-4 space-y-4">
        {statements.map((statement) => (
          <div key={statement.text} className="flex gap-3">
            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-gold/70" />
            <div>
              <p className="text-sm leading-7 text-silver/80">
                {statement.text}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <InlineSources sourceIds={statement.sourceIds} />
                {statement.status !== "verified" && (
                  <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-gold/70">
                    {statement.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="py-3.5">
      <dt className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
        {label}
      </dt>
      <dd
        className={`mt-1.5 text-xs leading-5 text-silver/85 ${mono ? "font-mono text-[10px]" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
