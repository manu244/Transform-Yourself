export enum WorkMode {
  WFH = 'WFH',
  OFFICE = 'OFFICE'
}

export enum ChallengePhase {
  DISCIPLINE = 'DISCIPLINE',
  GROWTH = 'GROWTH',
  TRANSFORMATION = 'TRANSFORMATION'
}

export interface TaskItem {
  id: string;
  timeRange: string;
  title: string;
  isCompleted: boolean;
  category: 'morning' | 'work' | 'evening';
}

export interface CustomTask {
  id: string;
  title: string;
  timeRange: string;
  category: 'morning' | 'work' | 'evening';
}

export interface DayData {
  date: string; // ISO date string YYYY-MM-DD
  completedTaskIds: string[];
  dailyNote: string;
  score: number; // 0-100 based on completion
}

export interface UserSettings {
  name: string;
  goal: string;
  workMode: WorkMode;
  startDate: string; // ISO date string
}

export interface AppState {
  settings: UserSettings;
  history: Record<string, DayData>; // Keyed by date
  customTasks: CustomTask[];
}