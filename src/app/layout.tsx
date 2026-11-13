import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://space-relics.afterlight.space"),
  title: {
    default: "SPACE RELICS — Humanity's Footprints Beyond Earth",
    template: "%s · SPACE RELICS",
  },
  description:
    "An interactive space archaeology archive of human-made objects on the Moon and Mars. Investigate rovers, landers, experiments, mission timelines, and evidence.",
  keywords: [
    "space archaeology",
    "Moon",
    "Mars",
    "Apollo",
    "NASA",
    "rover",
    "heritage",
    "AFTERLIGHT",
  ],
  authors: [{ name: "AFTERLIGHT" }],
  openGraph: {
    title: "SPACE RELICS",
    description:
      "Humanity's footprints beyond Earth. An independent interactive archive of space archaeology.",
    type: "website",
    siteName: "SPACE RELICS",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPACE RELICS",
    description:
      "Humanity's footprints beyond Earth. An interactive space archaeology archive.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07131F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 border border-gold bg-abyss px-4 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-gold transition-transform focus:translate-y-0"
        >
          Skip to archive
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 pt-[68px]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
