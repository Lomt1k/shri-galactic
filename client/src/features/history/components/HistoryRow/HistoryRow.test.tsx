import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryRow from './HistoryRow';
import type { StatisticLog } from '@/features/history/types';
import type { Statistic } from '@/shared/types';
import { useHistoryStore } from '@/features/history/store/HistoryStore.ts';
import { type StatisticCardListProps } from '@/shared/components/StatisticCardList/StatisticCardList.tsx';
import type { ModalProps } from '@/shared/components';

vi.mock('@/shared/components', () => ({
  Modal: ({ children, ...props }: Partial<ModalProps>) => <div {...props}>{children}</div>,
  StatisticCardList: ({ data }: Partial<StatisticCardListProps>) => (
    <div data-testid="statistic-card-list">{JSON.stringify(data)}</div>
  ),
}));

const mockRemove = vi.fn();

vi.mock('../../store/HistoryStore', () => ({
  useHistoryStore: vi.fn(),
}));

vi.mocked(useHistoryStore).mockImplementation(() => ({
  remove: mockRemove,
}));

const mockStats: Statistic = {
  rows_affected: 100,
  average_spend_galactic: 500,
  total_spend_galactic: 100500,
};

// Тестовые данные
const mockData: StatisticLog = {
  id: '1',
  filename: 'test.csv',
  date: '2023-04-05',
  stats: mockStats,
};

const mockDataWithoutStats: StatisticLog = {
  id: '2',
  filename: 'broken.csv',
  date: '2023-04-06',
  stats: null,
};

describe('Компонент HistoryRow', () => {
  test('корректно отрисовывает данные при наличии статистики', () => {
    // действие
    const { getByTestId } = render(<HistoryRow data={mockData} />);

    // проверка
    expect(getByTestId('history-row')).toBeInTheDocument();
    expect(getByTestId('history-row-content')).toBeInTheDocument();
    expect(getByTestId('history-row-filename')).toHaveTextContent(mockData.filename);
    expect(getByTestId('history-row-date')).toHaveTextContent(mockData.date);
    expect(getByTestId('history-row-success').className.split(' ')).toHaveLength(1);
    expect(getByTestId('history-row-error').className.split(' ')).toHaveLength(2);
    expect(getByTestId('history-row-remove-btn')).toBeInTheDocument();
  });

  test('корректно отрисовывает данные при отсутствии статистики', () => {
    // действие
    const { getByTestId } = render(<HistoryRow data={mockDataWithoutStats} />);

    // проверка
    expect(getByTestId('history-row')).toBeInTheDocument();
    expect(getByTestId('history-row-content')).toBeInTheDocument();
    expect(getByTestId('history-row-filename')).toHaveTextContent(mockDataWithoutStats.filename);
    expect(getByTestId('history-row-date')).toHaveTextContent(mockDataWithoutStats.date);
    expect(getByTestId('history-row-success').className.split(' ')).toHaveLength(2);
    expect(getByTestId('history-row-error').className.split(' ')).toHaveLength(1);
    expect(getByTestId('history-row-remove-btn')).toBeInTheDocument();
  });

  test('при клике на содержимое открывает модальное окно с данными', async () => {
    // подготовка
    const { getByTestId } = render(<HistoryRow data={mockData} />);
    const contentButton = getByTestId('history-row-content');

    // действие
    await userEvent.click(contentButton);

    // проверка
    expect(getByTestId('history-row-modal')).toBeInTheDocument();
    expect(getByTestId('statistic-card-list')).toHaveTextContent(JSON.stringify(mockData.stats));
  });

  test('при отсутствии статистики открывает пустое модальное окно', async () => {
    // подготовка
    const { getByTestId } = render(<HistoryRow data={mockDataWithoutStats} />);
    const contentButton = getByTestId('history-row-content');

    // действие
    await userEvent.click(contentButton);

    // проверка
    expect(getByTestId('history-row-modal-empty')).toBeInTheDocument();
    expect(getByTestId('history-row-modal-empty-text')).toHaveTextContent(mockDataWithoutStats.filename);
  });

  test('при клике на кнопку удаления вызывает удаление из стора', async () => {
    // подготовка
    const { getByTestId } = render(<HistoryRow data={mockData} />);
    const removeButton = getByTestId('history-row-remove-btn');

    // действие
    await userEvent.click(removeButton);

    // проверка
    expect(mockRemove).toHaveBeenCalledWith(mockData.id);
  });
});
