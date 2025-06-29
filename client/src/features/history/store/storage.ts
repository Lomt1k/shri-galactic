import { isStatisticLog, type StatisticLog } from '@/features/history/types';

export const loadFromStorage = (): StatisticLog[] => {
  try {
    const json = localStorage.getItem('history');
    if (!json) return [];

    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || !parsed.every(isStatisticLog)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
    return [];
  }
};

export const saveToStorage = (logs: StatisticLog[]) => {
  try {
    localStorage.setItem('history', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save history to localStorage', error);
  }
};
