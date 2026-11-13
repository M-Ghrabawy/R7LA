import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react";
import { archiveStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About the Archive",
  description:
    "About SPACE RELICS by AFTERLIGHT: data methodology, source policy, NASA media attribution, AI disclosure, and known limitations.",
};

const sourceGroups = [
  {
    label: "Mission and spacecraft records",
    links: [
      {
        href: "https://nssdc.gsfc.nasa.gov/nmc/",
        label: "NASA NSSDCA Master Catalog",
      },
      {
        href: "https://science.nasa.gov/solar-system/",
        label: "NASA Solar System Exploration",
      },
      {
        href: "https://www.nasa.gov/history/alsj-and-afj/",
        label: "Apollo Lunar Surface Journal",
      },
    ],
  },
  {
    label: "Imagery and mapping",
    links: [
      {
        href: "https://images.nasa.gov/",
        label: "NASA Image and Video Library",
      },
      {
        href: "https://astrogeology.usgs.gov/",
        label: "USGS Astrogeology",
      },
      {
        href: "https://pds.nasa.gov/",
        label: "NASA Planetary Data System",
      },
    ],
  },
  {
    label: "Laser ranging and lunar geodesy",
    links: [
      {
        href: "https://ilrs.gsfc.nasa.gov/",
        label: "International Laser Ranging Service",
      },
      {
        href: "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html",
        label: "Apollo Landing Site Coordinates",
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="border-b border-line/70 pb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[9px] text-gold">07</span>
          <span className="h-px w-8 bg-line-bright" />
          <span className="technical-label">Afterlight / archive notes</span>
        </div>
        <h1 className="max-w-5xl text-balance text-5xl font-medium leading-[0.92] tracking-[-0.055em] text-white md:text-8xl">
          We preserve the
          <span className="text-gold"> traces.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">
          SPACE RELICS is an independent digital space-archaeology archive built
          by AFTERLIGHT. It treats the objects humans leave on other worlds as
          evidence, heritage, and unfinished experiments.
        </p>
      </div>

      <div className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-medium tracking-[-0.035em] text-white md:text-4xl">
            What this archive is.
          </h2>
          <div className="article-prose mt-6 max-w-2xl">
            <p>
              SPACE RELICS documents human-made objects beyond Earth: descent
              stages, instruments, rovers, landers, and the places they occupy.
              Each record combines mission history, physical and operational
              status, coordinates, a chronology, historical photography, an
              interactive schematic, evidence claims, and links to primary
              sources.
            </p>
            <p>
              The primary archive currently contains {archiveStats.relics}
              full object investigations across the Moon and Mars, drawn from{" "}
              {archiveStats.missions} missions, with an additional extended NASA
              catalogue covering small bodies, deep-space probes, and later Mars
              hardware. Every missing field is left missing rather than filled
              with plausible-looking data. Where a position is approximate, the
              record says so. Where an object is still active, it is not
              described as abandoned.
            </p>
            <p>
              The Legacy Score is an original editorial instrument by
              AFTERLIGHT. It is not a NASA rating, an agency priority, or a
              measure of human worth. It is a transparent way to explore how
              different definitions of “importance” change the ranking.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Metric value={archiveStats.relics} label="Object records" />
            <Metric value={archiveStats.identifiedSources} label="Source records" />
            <Metric value={archiveStats.active} label="Active or detectable" />
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-gold/25 bg-gold/[0.025] p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                Independence statement
              </p>
            </div>
            <p className="mt-4 text-sm leading-7 text-silver/75">
              SPACE RELICS is not affiliated with, endorsed by, or operated by
              NASA. NASA logos and insignia are not used. NASA imagery is
              presented with attribution and links to the NASA Image and Video
              Library. Any agency name appears only to identify a source or a
              mission.
            </p>
            <div className="mt-5 border-t border-gold/20 pt-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                Project
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                SPACE RELICS / AFTERLIGHT
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                Humanity&apos;s footprints beyond Earth
              </p>
            </div>
          </div>

          <div className="mt-4 border border-line/70 bg-panel/20 p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-bright">
              Built with
            </p>
            <p className="mt-3 text-[11px] leading-6 text-muted">
              Next.js, TypeScript, Three.js, React Three Fiber, Tailwind CSS,
              GSAP, Framer Motion, Zod, and a deliberately small local data
              layer. No database is required for the current archive.
            </p>
          </div>
        </aside>
      </div>

      <section className="border-y border-line/60 bg-void/30 py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
              Data method
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white">
              Provenance before prose.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              The dataset is separate from the interface and validated against a
              runtime schema. Claims carry their own source references so the
              evidence page and the AI assistant use the same provenance graph.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <Method
              index="01"
              title="Collect"
              text="Use official mission records, NSSDCA entries, coordinate references, and NASA imagery metadata."
            />
            <Method
              index="02"
              title="Verify"
              text="Do not infer missing dates, lifetimes, or locations. Record precision and uncertainty explicitly."
            />
            <Method
              index="03"
              title="Separate"
              text="Keep mission records, scientific interpretations, and hypothetical scenarios in distinct evidence states."
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
              Sources
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white">
              Where the record comes from.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              Source URLs are stored with every record. The list below is a
              starting point, not a substitute for the citations attached to
              individual claims.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {sourceGroups.map((group) => (
              <div key={group.label}>
                <p className="border-b border-line/60 pb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-silver">
                  {group.label}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-1.5 text-[11px] leading-5 text-muted transition-colors hover:text-silver"
                      >
                        {link.label}
                        <ArrowUpRight className="mt-0.5 size-3 shrink-0 opacity-50 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line/60 py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border border-line/70 bg-panel/20 p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-bright">
              Media licensing and attribution
            </p>
            <p className="mt-4 text-[12px] leading-6 text-muted">
              Historical photographs are sourced from the NASA Image and Video
              Library and link to their original records. NASA content is
              generally not protected by copyright in the United States; NASA
              insignia and identifiers remain protected. No NASA logo is used,
              and no endorsement is implied. Original diagrams, schematics, and
              planet visualizations are AFTERLIGHT work and are not presented as
              NASA hardware or mission photography.
            </p>
            <a
              href="https://www.nasa.gov/nasa-brand-center/images-and-media/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-gold hover:text-white"
            >
              NASA media guidelines
              <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="border border-line/70 bg-panel/20 p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
              AI disclosure
            </p>
            <p className="mt-4 text-[12px] leading-6 text-muted">
              REX is a fictional AFTERLIGHT archive guide and the conversational
              interface over this archive. Without an API key, the assistant runs
              in a deterministic REX demo mode that generates answers from
              structured records; no LLM is running. When a live provider is
              configured, the interface labels that mode. In all cases, answers
              are constrained to archive context, citations resolve to stored
              sources, and hypothetical statements are marked. The AI does not
              create citations. REX is not a NASA robot or agency system.
            </p>
            <p className="mt-3 font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted/60">
              The five-chapter expedition, vector scenes, and REX dialogue are
              interpretive fiction built around sourced records. Ambient audio
              and interface cues are synthesized in the browser and muted until
              the visitor enables sound.
            </p>
            <p className="mt-3 font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted/60">
              Demo mode is not a simulation of a live model. It is plainly
              labeled as a curated archive response.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line/60 py-12 md:py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
              Known limitations
            </p>
            <ul className="mt-4 max-w-2xl space-y-2 text-[12px] leading-6 text-muted">
              <li>
                → Some rover positions are landing regions or approximate final
                areas. This is stated on each record.
              </li>
              <li>
                → No authentic NASA 3D model is bundled in this build. Object
                schematics are original AFTERLIGHT visualizations and clearly
                labeled.
              </li>
              <li>
                → The Legacy Score is editorial. Its dimensions and weights are
                transparent, but it is not an official rating.
              </li>
              <li>
                → The archive is not a live mission-status feed. Active status is
                recorded from cited mission material and should be checked
                against current NASA updates.
              </li>
              <li>
                → REX, its dialogue, and the vector field scenes are original
                fictional interfaces, not NASA mission records or recovered
                telemetry.
              </li>
              <li>
                → Story puzzles are educational reconstructions. They are not
                official simulations of mission operations or engineering
                systems.
              </li>
            </ul>
          </div>
          <Link
            href="/explore"
            className="inline-flex shrink-0 items-center gap-2 border border-gold bg-gold px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss transition-colors hover:bg-[#f2c76a]"
          >
            Explore the archive
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="border border-line/60 bg-panel/20 p-4">
      <p className="font-mono text-2xl text-silver">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.11em] text-muted">
        {label}
      </p>
    </div>
  );
}

function Method({
  index,
  title,
  text,
}: {
  index: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-line/60 pt-4">
      <span className="font-mono text-[8px] text-gold">{index}</span>
      <h3 className="mt-2 text-sm font-medium text-white">{title}</h3>
      <p className="mt-2 text-[11px] leading-5 text-muted">{text}</p>
    </div>
  );
}
