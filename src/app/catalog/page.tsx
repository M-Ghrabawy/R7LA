import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { extendedCatalog } from "@/data/extended-catalog";

export const metadata: Metadata = {
  title: "Extended NASA Catalogue",
  description:
    "Additional NASA artifacts beyond the primary SPACE RELICS investigations: ALSEP, Surveyor 1, Apollo 17 LRV, Viking 2, Phoenix, InSight, Ingenuity, Dawn, NEAR Shoemaker, Pioneer 10 and 11, and Kepler.",
};

export default function CatalogPage() {
  return <CatalogExplorer objects={extendedCatalog} />;
}
