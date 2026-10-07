// Short links to AFW's Tally forms, e.g. afriendlywave.com/join.
// To add a form, add an entry here; src/pages/[form].astro builds a page for each.
// tallyId is the code at the end of the form's tally.so/r/<id> link.

export interface AfwForm {
  slug: string;
  tallyId: string;
  heading: string;
  description: string; // link-preview text (WhatsApp, iMessage, etc.)
}

export const forms: AfwForm[] = [
  {
    slug: "join",
    tallyId: "b50vO0",
    heading: "Stay in Touch",
    description:
      "Get event news and find ways to take part: volunteering, spinning records, selling at a swap or hosting something.",
  },
  {
    slug: "artists",
    tallyId: "kdVv5d",
    heading: "Artist & Presenter: Submit Info",
    description:
      "Playing, presenting or showing work with AFW? Send us what we need to promote you.",
  },
  {
    slug: "vendors",
    tallyId: "XxKzEe",
    heading: "Record Swap & Shop: Vendor Application",
    description:
      "Sell records at the AFW Record Swap & Shop, Sat Oct 24, 10am–2pm at Cassette Café. Free vendor space. Apply by Oct 19.",
  },
  {
    slug: "workshop",
    tallyId: "zxaLZZ",
    heading: "Youth DJ Workshop: Registration",
    description:
      "A free intro DJ workshop for young people (ages 8+) with Graham Van Pelt. Sun Oct 25, 2–4pm at Cassette Café.",
  },
];
