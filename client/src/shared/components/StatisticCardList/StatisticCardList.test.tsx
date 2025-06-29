import { render } from '@testing-library/react';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import StatisticCardList, { type RowData } from './StatisticCardList';
import type { Statistic } from '@/shared/types';
import { prepareRows } from '@/shared/components/StatisticCardList/prepareRows.ts';
import type { StatisticCardProps } from '@/shared/components/StatisticCard';

vi.mock('@/shared/components', () => ({
  StatisticCard: ({ value, description }: Partial<StatisticCardProps>) => {
    return (
      <div data-testid="statistic-card-mock">
        <span data-testid="statistic-card-mock__value">{value}</span>
        <span data-testid="statistic-card-mock__desc">{description}</span>
      </div>
    );
  },
}));

describe('Компонент StatisticCardList', () => {
  const mockData: Statistic = {
    total_spend_galactic: 100500,
    average_spend_galactic: 123.45,
    rows_affected: 2236,
    big_spent_at: 123,
    big_spent_civ: 'Galactic Empire',
    big_spent_value: 99999,
    less_spent_at: 115,
    less_spent_civ: 'Rebel Alliance',
    less_spent_value: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('рендерит все карточки статистики из prepareRows', () => {
    // подготовка
    const rowDatas: RowData[] = prepareRows(mockData);

    // действие
    const { getAllByTestId } = render(<StatisticCardList data={mockData} />);

    // проверка
    expect(getAllByTestId('statistic-card-mock')).toHaveLength(rowDatas.length);
  });

  test('передаёт правильные пропсы value и description в StatisticCard', () => {
    // подготовка
    const rowDatas: RowData[] = prepareRows(mockData);

    // действие
    const { getAllByTestId } = render(<StatisticCardList data={mockData} />);

    // проверка
    const allValues = getAllByTestId('statistic-card-mock__value').map((el) => el.textContent);
    const allDescriptions = getAllByTestId('statistic-card-mock__desc').map((el) => el.textContent);
    rowDatas.forEach(([description, value]) => {
      expect(allValues).toContain(value);
      expect(allDescriptions).toContain(description);
    });
  });

  test('рендерит только обязательные поля, если опциональные отсутствуют', () => {
    // подготовка
    const minimalData: Statistic = {
      total_spend_galactic: 100500,
      average_spend_galactic: 123.45,
      rows_affected: 2236,
    };
    const rowDatas = prepareRows(minimalData);

    // действие
    const { getAllByTestId } = render(<StatisticCardList data={minimalData} />);

    // проверка
    expect(getAllByTestId('statistic-card-mock')).toHaveLength(rowDatas.length);
  });
});
