export interface ReadingPlan {
  id: string;
  title: string;
  days: number;
  image: string;
  category: string;
  description: string;
  content: DayContent[];
}

export interface DayContent {
  day: number;
  title: string;
  verses: string[];
  devotional: string;
  questions: string[];
  prayer: string;
}

export interface UserPlanProgress {
  planId: string;
  currentDay: number;
  completed: boolean;
  startDate: string;
  lastReadDate: string;
  completedDays: number[];
}
