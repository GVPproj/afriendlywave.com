// Short links to AFW's Tally forms, e.g. afriendlywave.com/join.
// To add a form, add an entry here; src/pages/[form].astro builds a page for each.
// tallyId is the code at the end of the form's tally.so/r/<id> link.

export interface AfwForm {
  slug: string;
  tallyId: string;
  heading: string;
  title: string;
}

export const forms: AfwForm[] = [
  {
    slug: "join",
    tallyId: "b50vO0",
    heading: "Stay in Touch",
    title: "Stay in touch - A Friendly Wave",
  },
  {
    slug: "artists",
    tallyId: "kdVv5d",
    heading: "Artist & Presenter: Submit Info",
    title: "Artist & presenter info - A Friendly Wave",
  },
  {
    slug: "vendors",
    tallyId: "XxKzEe",
    heading: "Record Swap & Shop: Vendor Application",
    title: "Vendor application - A Friendly Wave",
  },
  {
    slug: "workshop",
    tallyId: "zxaLZZ",
    heading: "Youth DJ Workshop: Registration",
    title: "Youth DJ workshop - A Friendly Wave",
  },
];
