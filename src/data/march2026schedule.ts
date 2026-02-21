import type { ScheduleData } from "./scheduleTypes";

export type { TimeSlot, Section, Day, ScheduleData } from "./scheduleTypes";

export const march2026: ScheduleData = {
  month: "March 2026",
  days: [
    {
      label: "FRI MARCH 6",
      shortLabel: { day: "FRI", month: "MARCH", date: "6" },
      sections: [
        {
          mode: "COMMUNITY CURATION",
          slots: [
            {
              time: "5:30pm",
              description:
                "DJ Flip presents: My Jazz and R&B journey from age 0–7",
            },
          ],
        },
      ],
    },
    {
      label: "SAT MARCH 7",
      shortLabel: { day: "SAT", month: "MARCH", date: "7" },
      sections: [
        {
          mode: "CAFÉ MODE",
          slots: [
            { time: "10:00am", description: "Bo Meets World" },
            { time: "11:30am", description: "Connie Kuhns" },
          ],
        },
        {
          mode: "COMMUNITY CURATION",
          slots: [
            {
              time: "4:00pm",
              description: "Jamie Wollen connects the musical dots on his path to becoming a professional drummer",
            },
          ],
        },
        {
          mode: "DARK MODE",
          note: "* $20 advance/door",
          link: "https://www.eventbrite.ca/e/dark-mode-dj-ddee-tickets-1983182608568?aff=affiliate3",
          slots: [
            {
              time: "*7:00pm–late",
              description: "DJ D.DEE w/ Graham Van Pelt",
            },
          ],
        },
      ],
    },
    {
      label: "SUN MARCH 8",
      shortLabel: { day: "SUN", month: "MARCH", date: "8" },
      sections: [
        {
          mode: "CAFÉ MODE",
          slots: [
            { time: "10:00am", description: "Jeff Stefani" },
            { time: "11:30am", description: "Leo Chan" },
          ],
        },
        {
          mode: "DEEP LISTENING",
          note: "* no entry after 3pm",
          slots: [
            {
              time: "*Doors: 2:30pm",
              description:
                'Robert Kraft presents: "Light as a Feather" Chick Corea and Return to Forever',
            },
          ],
        },
      ],
    },
  ],
};
