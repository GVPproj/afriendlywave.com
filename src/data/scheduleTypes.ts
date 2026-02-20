export interface TimeSlot {
  time: string;
  description: string;
}

export interface Section {
  mode: string;
  note?: string;
  link?: string;
  slots: TimeSlot[];
}

export interface Day {
  label: string;
  shortLabel: { day: string; month: string; date: string };
  sections: Section[];
}

export interface ScheduleData {
  month: string;
  days: Day[];
}
