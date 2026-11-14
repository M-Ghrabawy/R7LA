import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";

const archiveLinks = [
  { href: "/explore", label: "Planet Explorer" },
  { href: "/catalog", label: "Extended NASA Catalogue" },
  { href: "/rex", label: "REX Expedition" },
  { href: "/timeline", label: "Mission Timeline" },
  { href: "/about", label: "About the Archive" },
];

const resourceLinks = [
  {
    href: "https://images.nasa.gov/",
    label: "NASA Image Library",
  },
  {
    href: "https://nssdc.gsfc.nasa.gov/nmc/",
    label: "NSSDCA Master Catalog",
  },
  {
    href: "https://science.nasa.gov/solar-system/",
    label: "NASA Solar System",
  },
  {
    href: "https://astrogeology.usgs.gov/",
    label: "USGS Astrogeology",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line/60 bg-void/50">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
            An independent digital archaeology platform preserving the traces of
            humanity beyond Earth. Built as an editorial archive, not an
            official agency record.
          </p>
          <p className="mt-6 max-w-sm border-l border-gold/50 pl-4 font-mono text-[9px] uppercase leading-5 tracking-[0.14em] text-gold/80">
            AFTERLIGHT · Humanity&apos;s footprints beyond Earth.
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-7">
          <p className="technical-label mb-4 text-silver">Archive</p>
          <ul className="space-y-2.5">
            {archiveLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-silver"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="technical-label mb-4 text-silver">Authoritative sources</p>
          <ul className="space-y-2.5">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver"
                >
                  {link.label}
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line/50">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            NASA imagery is public domain unless otherwise noted. No NASA logo
            or endorsement is implied.
          </p>
          <p className="text-muted/70">
            R7LA © 2026 AFTERLIGHT · Archive status: active
          </p>
        </div>
      </div>
    </footer>
  );
}
