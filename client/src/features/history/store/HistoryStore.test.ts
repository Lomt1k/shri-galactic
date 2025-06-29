import { describe, test, expect, vi } from 'vitest';
import { createHistoryStoreForTest, type HistoryState } from './HistoryStore';
import * as historyStorage from './storage';
import type { UseBoundStore } from 'zustand/react';
import type { StoreApi } from 'zustand/vanilla';

vi.mock('./storage', () => ({
  loadFromStorage: vi.fn(() => []),
  saveToStorage: vi.fn(),
}));

describe('HistoryStore', () => {
  const mockLoadFromStorage = vi.mocked(historyStorage.loadFromStorage);
  const mockSaveToStorage = vi.mocked(historyStorage.saveToStorage);

  let useTestStore: UseBoundStore<StoreApi<HistoryState>>;

  beforeEach(() => {
    mockLoadFromStorage.mockClear();
    mockSaveToStorage.mockClear();
    useTestStore = createHistoryStoreForTest([]);
  });

  test('вызывает saveToStorage при добавлении записи', () => {
    // Подготовка
    const store = useTestStore;

    // Действие
    store.getState().add(
      {
        rows_affected: 100,
        average_spend_galactic: 500,
        total_spend_galactic: 100500,
      },
      'new-file.csv'
    );

    const state = store.getState();

    // Проверка
    expect(state.logs).toHaveLength(1);
    expect(state.logs[0]).toMatchObject({
      filename: 'new-file.csv',
      stats: {
        rows_affected: 100,
        average_spend_galactic: 500,
        total_spend_galactic: 100500,
      },
    });

    expect(mockSaveToStorage).toHaveBeenCalledWith(state.logs);
  });

  test('удаляет запись по ID через remove()', () => {
    // подготовка
    const initialLogs = [
      { id: '1', filename: 'file1.csv', date: '01.01.2024', stats: null },
      { id: '2', filename: 'file2.csv', date: '01.01.2024', stats: null },
    ];

    const store = createHistoryStoreForTest(initialLogs);

    // действие
    store.getState().remove('1');

    // проверка
    const updatedState = store.getState();
    expect(updatedState.logs).toHaveLength(1);
    expect(updatedState.logs[0].id).toBe('2');
    expect(mockSaveToStorage).toHaveBeenCalledWith([
      { id: '2', filename: 'file2.csv', date: '01.01.2024', stats: null },
    ]);
  });

  test('очищает все записи через clear()', () => {
    // подготовка
    const initialLogs = [{ id: '1', filename: 'file1.csv', date: '01.01.2024', stats: null }];
    const store = createHistoryStoreForTest(initialLogs);

    // действие
    store.getState().clear();

    // проверка
    const updatedState = store.getState();
    expect(updatedState.logs).toHaveLength(0);
    expect(mockSaveToStorage).toHaveBeenCalledWith([]);
  });
});
