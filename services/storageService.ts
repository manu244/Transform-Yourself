import { AppState, UserSettings, DayData, WorkMode } from '../types.ts';

const STORAGE_KEY = 'transform30_app_data';

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  goal: '',
  workMode: WorkMode.WFH,
  startDate: new Date().toISOString(),
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return {
        settings: DEFAULT_SETTINGS,
        history: {},
        customTasks: []
      };
    }
    const parsed = JSON.parse(serialized);
    return {
      ...parsed,
      customTasks: parsed.customTasks || []
    };
  } catch (e) {
    console.error("Failed to load state", e);
    return {
      settings: DEFAULT_SETTINGS,
      history: {},
      customTasks: []
    };
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const getTodayKey = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const calculateDaysSinceStart = (startDateStr: string): number => {
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays; // 1-based index
};