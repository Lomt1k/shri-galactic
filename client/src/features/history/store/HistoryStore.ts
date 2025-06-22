import type { Statistic } from '@/shared/types';
import { create } from 'zustand';
import { isStatisticLog, type StatisticLog } from '../types';

export type HistoryState = {
  logs: StatisticLog[];
  add: (stats: Statistic | null, filename: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const loadFromStorage = (): StatisticLog[] => {
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

const saveToStorage = (logs: StatisticLog[]) => {
  try {
    localStorage.setItem('history', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save history to localStorage', error);
  }
};

export const useHistoryState = create<HistoryState>((set, get) => ({
  logs: loadFromStorage(),
  add: (stats, filename) => {
    const { logs } = get();
    const date = new Date().toLocaleDateString('ru-RU');
    const id = crypto.randomUUID?.() ?? Math.random().toString();
    const newLog: StatisticLog = { id, filename, date, stats };
    const updatedLogs = [...logs, newLog];
    set({ logs: updatedLogs });
    saveToStorage(updatedLogs);
  },
  remove: (id) => {
    const { logs } = get();
    const updatedLogs = logs.filter((log) => log.id !== id);
    set({ logs: updatedLogs });
    saveToStorage(updatedLogs);
  },
  clear: () => {
    set({ logs: [] });
    saveToStorage([]);
  },
}));
