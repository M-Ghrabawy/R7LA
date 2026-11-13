"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Observatory" },
  { href: "/explore", label: "Explore" },
  { href: "/timeline", label: "Timeline" },
  { href: "/evidence", label: "Evidence" },
  { href: "/legacy", label: "Legacy" },
  { href: "/archaeologist", label: "Archaeologist" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-abyss/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="SPACE RELICS Observatory" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.slice(1).map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-3 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-gold after:absolute after:inset-x-3 after:bottom-1 after:h-px after:bg-gold"
                    : "text-muted hover:text-silver",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="hidden items-center gap-2 border border-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-teal hover:text-teal-bright sm:flex"
          >
            <Search className="size-3" />
            Index
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="flex size-10 items-center justify-center border border-line text-silver transition-colors hover:border-gold hover:text-gold lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 sm:max-w-sm">
              <div className="border-b border-line px-5 py-5">
                <DialogTitle className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Archive navigation
                </DialogTitle>
              </div>
              <nav className="flex flex-col p-3" aria-label="Mobile">
                {nav.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-line/50 px-3 py-4 text-sm tracking-wide",
                      pathname === item.href
                        ? "text-gold"
                        : "text-silver hover:text-white",
                    )}
                  >
                    {item.label}
                    <span className="font-mono text-[9px] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                ))}
              </nav>
              <p className="px-5 pb-5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                Independent editorial archive · Not affiliated with NASA
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
