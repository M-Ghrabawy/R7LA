import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  CircleCheck,
  Database,
  Quote,
  Radio,
  ScanSearch,
} from "lucide-react";
import { ObservatoryExperience } from "@/components/observatory/observatory-experience";
import { RexCharacter } from "@/components/rex/rex-character";
import { RelicCard } from "@/components/shared/relic-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  archiveStats,
  computeLegacyTotal,
  getRelic,
  relics,
} from "@/lib/data";
import { toSceneRelic } from "@/lib/scene-types";

export const metadata: Metadata = {
  title: "SPACE RELICS — Humanity's Footprints Beyond Earth",
  description:
    "Enter the Observatory: an interactive space archaeology archive of human artifacts on the Moon and Mars.",
};

const featuredIds = [
  "apollo-11-laser-ranging-retroreflector",
  "opportunity",
  "lunokhod-1",
];

export default function HomePage() {
  const sceneRelics = relics.map((relic) =>
    toSceneRelic(relic, computeLegacyTotal(relic.legacy)),
  );
  const featured = featuredIds
    .map((id) => getRelic(id))
    .filter((relic): relic is NonNullable<typeof relic> => Boolean(relic));
  const moonImage = getRelic("apollo-15-lunar-roving-vehicle")?.images[0];
  const marsImage = getRelic("perseverance")?.images[0];

  return (
    <>
      <ObservatoryExperience relics={sceneRelics} stats={archiveStats} />

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          index="02"
          label="The archive"
          title={
            <>
              The things we left behind
              <br />
              <span className="text-muted">are still there.</span>
            </>
          }
          description="Space archaeology reads the physical record of exploration: descent stages, rovers, retroreflectors, landers, and the landscapes they changed. Begin with three objects that redefined what it means to leave something behind."
          action={
            <Link
              href="/explore"
              className="inline-flex items-center gap-3 border border-line-bright px-5 py-3 font-mono text-[9px] uppercase tracking-[0.15em] text-silver transition-colors hover:border-gold hover:text-gold"
            >
              Open the full index
              <ArrowUpRight className="size-3.5" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featured.map((relic, index) => (
            <Reveal key={relic.id} delay={index * 0.08}>
              <RelicCard
                relic={relic}
                index={`R-${String(index + 1).padStart(2, "0")}`}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line/60 bg-void/35">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading
            index="03"
            label="Two worlds"
            title="Read the surface like a document."
            description="Select a world, locate an artifact, and follow its coordinates into the investigation record. Positions are sourced, precision is disclosed, and uncertain locations are marked as such."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <WorldPanel
              destination="Moon"
              image={moonImage}
              count={relics.filter((relic) => relic.destination === "Moon").length}
              span="1967 — 1972"
              description="Crewed descent stages, robotic landers, a rover left in the dust, and instruments still returning measurements from the lunar surface."
            />
            <WorldPanel
              destination="Mars"
              image={marsImage}
              count={relics.filter((relic) => relic.destination === "Mars").length}
              span="1976 — PRESENT"
              description="Seven landers and rovers spanning the first successful Mars landing to the sample-caching missions now working in Jezero Crater."
            />
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-[radial-gradient(ellipse_at_18%_50%,rgba(11,122,143,.12),transparent_50%)]">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <div className="relative flex justify-center">
              <div className="absolute inset-8 rounded-full border border-teal/15" />
              <div className="absolute inset-14 rounded-full border border-dashed border-line-bright/40" />
              <RexCharacter
                pose="point"
                expression="excited"
                className="relative h-[260px] w-auto md:h-[340px]"
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
              REX / autonomous archaeological explorer
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-white md:text-6xl">
              Not treasure.
              <span className="text-teal-bright"> Knowledge.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
              REX is an original fictional archive guide built by AFTERLIGHT. It
              explores the Moon and Mars through five interactive chapters,
              investigates any relic on request, and asks what humanity should
              preserve for the future.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/rex"
                className="inline-flex items-center gap-3 border border-gold bg-gold px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss transition-colors hover:bg-[#f2c76a]"
              >
                Begin the REX expedition
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/archaeologist"
                className="inline-flex items-center gap-3 border border-line-bright px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-silver transition-colors hover:border-teal hover:text-teal-bright"
              >
                Talk to REX
              </Link>
            </div>
            <p className="mt-4 font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60">
              Fictional character · interpretive animation · sourced archive
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <div className="border border-line p-6 md:p-10">
              <div className="flex items-center gap-3">
                <BookOpenCheck className="size-4 text-gold" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                  Evidence chain / primary record
                </p>
              </div>
              <Quote className="mt-10 size-7 text-teal/60" />
              <blockquote className="mt-4 max-w-2xl text-balance text-3xl font-medium leading-[1.15] tracking-[-0.035em] text-white md:text-5xl">
                “Every important claim must resolve to a source, a status, and a
                reason to believe it.”
              </blockquote>
              <p className="mt-6 max-w-xl text-sm leading-7 text-muted">
                Verified mission records are separated from scientific
                interpretations and hypothetical scenarios. No citation is
                invented. No missing field is filled with guesswork.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line/60 pt-6">
                <EvidenceStat
                  icon={<CircleCheck />}
                  label="Verified"
                  value="Mission records"
                />
                <EvidenceStat
                  icon={<ScanSearch />}
                  label="Interpretation"
                  value="Scientific reading"
                />
                <EvidenceStat
                  icon={<Radio />}
                  label="Hypothesis"
                  value="Clearly labeled"
                />
              </div>
              <Link
                href="/evidence"
                className="mt-8 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-teal-bright transition-colors hover:text-gold"
              >
                Inspect the evidence ledger
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between border border-line bg-panel/35 p-6 md:p-10">
              <div>
                <div className="flex items-center gap-3">
                  <Database className="size-4 text-teal" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-bright">
                    Archive metrics
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-px border border-line/70 bg-line/60">
                  <Metric value={archiveStats.relics} label="Objects" />
                  <Metric value={archiveStats.worlds} label="Worlds" />
                  <Metric value={archiveStats.missions} label="Missions" />
                  <Metric
                    value={archiveStats.identifiedSources}
                    label="Source records"
                  />
                </div>
              </div>
              <div className="mt-10 border-t border-line/60 pt-6">
                <p className="font-mono text-[8px] uppercase leading-5 tracking-[0.14em] text-muted">
                  Data model v1.0 / coordinates sourced from NASA NSSDCA and
                  published mission records. Image assets link back to the NASA
                  Image and Video Library.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line/60 bg-[radial-gradient(ellipse_at_50%_120%,rgba(11,122,143,.18),transparent_65%)]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
                04 / AI Space Archaeologist
              </p>
              <h2 className="mt-6 max-w-4xl text-balance text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-white md:text-6xl">
                Ask what happened after
                <span className="text-teal-bright"> the mission ended.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
                Select a relic and ask why it was left behind, what it
                discovered, or whether it still matters. Answers are grounded in
                the archive and cite their sources. Hypotheticals are labeled.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/archaeologist"
                  className="inline-flex items-center gap-3 border border-gold bg-gold px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.15em] text-abyss transition-colors hover:bg-[#f2c76a]"
                >
                  Open the assistant
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/legacy"
                  className="inline-flex items-center gap-3 border border-line-bright px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.15em] text-silver transition-colors hover:border-teal hover:text-teal-bright"
                >
                  Read the Legacy methodology
                </Link>
              </div>
              <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.12em] text-muted/70">
                Curated demo available without an API key. Live model mode is
                explicitly labeled when configured.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border border-line/70 bg-abyss/50 p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                  Try a question
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    "Why was this object left behind?",
                    "Is it still scientifically useful?",
                    "What did humanity learn from it?",
                  ].map((question) => (
                    <Link
                      key={question}
                      href={`/archaeologist?q=${encodeURIComponent(question)}`}
                      className="group flex items-start justify-between gap-4 border border-line/60 px-3 py-3 text-xs leading-5 text-silver/80 transition-colors hover:border-teal/50 hover:text-white"
                    >
                      {question}
                      <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted group-hover:text-gold" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function WorldPanel({
  destination,
  image,
  count,
  span,
  description,
}: {
  destination: "Moon" | "Mars";
  image: { src: string; alt: string } | undefined;
  count: number;
  span: string;
  description: string;
}) {
  return (
    <Link
      href={`/explore?world=${destination}`}
      className="group relative min-h-[440px] overflow-hidden border border-line bg-void"
    >
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-45 grayscale-[25%] transition duration-1000 group-hover:scale-[1.035] group-hover:opacity-60 group-hover:grayscale-0"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,16,.25),rgba(3,10,16,.45)_45%,rgba(3,10,16,.96))]" />
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
              {span}
            </p>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/60">
              {String(count).padStart(2, "0")} catalogued objects
            </p>
          </div>
          <span className="flex size-10 items-center justify-center border border-line-bright bg-abyss/40 text-silver transition-colors group-hover:border-gold group-hover:text-gold">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div>
          <h3 className="text-5xl font-medium tracking-[-0.05em] text-white md:text-7xl">
            {destination}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-silver/65">
            {description}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-gold">
            Enter {destination === "Moon" ? "lunar" : "Martian"} archive
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-panel/80 p-4">
      <p className="font-mono text-2xl text-silver">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
    </div>
  );
}

function EvidenceStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="text-teal [&_svg]:size-4">{icon}</span>
      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-silver">
        {label}
      </p>
      <p className="mt-1 text-xs text-muted">{value}</p>
    </div>
  );
}
