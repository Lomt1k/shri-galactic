import type { Statistic } from '@/shared/types';
import { create } from 'zustand';
import { type StatisticLog } from '../types';
import { loadFromStorage, saveToStorage } from '@/features/history/store/storage.ts';

export type HistoryState = {
  logs: StatisticLog[];
  add: (stats: Statistic | null, filename: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
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

export const createHistoryStoreForTest = (initialLogs: StatisticLog[] = []) =>
  create<HistoryState>((set, get) => ({
    logs: initialLogs,
    add: (stats, filename) => {
      const { logs } = get();
      const date = new Date().toLocaleDateString('ru-RU');
      const id = crypto.randomUUID?.() ?? Math.random().toString();
      const newLog = { id, filename, date, stats };
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

export function clearHistoryStoreForTests() {
  const initialState = {
    logs: [],
    add: useHistoryStore.getState().add,
    remove: useHistoryStore.getState().remove,
    clear: useHistoryStore.getState().clear,
  };
  useHistoryStore.setState(initialState, true); // ← force = true очищает полностью
}
