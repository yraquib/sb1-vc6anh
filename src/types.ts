export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  goalIds: string[];
  repeat?: boolean;
}

export type Period = '30days' | 'week' | 'month';