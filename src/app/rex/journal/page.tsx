import type { Metadata } from "next";
import { JournalView } from "@/components/rex/journal-view";

export const metadata: Metadata = {
  title: "REX Field Journal",
  description:
    "REX's locally stored expedition journal: completed scenes, interaction discoveries, and source-linked field notes.",
};

export default function RexJournalPage() {
  return <JournalView />;
}
