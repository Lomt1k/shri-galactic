import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import History from './History';
import type { StatisticLog } from '@/features/history/types';
import { useHistoryStore } from '@/features/history/store/HistoryStore.ts';
import type { HistoryRowProps } from '@/features/history/components';
import type { ButtonLinkProps, ButtonProps, ContainerProps } from '@/shared/components';

vi.mock('../../store/HistoryStore', () => ({
  useHistoryStore: vi.fn(),
}));

const mockClear = vi.fn();

const mockUseHistoryStore = vi.fn().mockReturnValue({
  logs: [] as StatisticLog[],
  clear: mockClear,
});

vi.mocked(useHistoryStore).mockImplementation(() => mockUseHistoryStore());

vi.mock('../HistoryRow', () => ({
  HistoryRow: ({ data }: HistoryRowProps) => <div data-testid={`history-row-content-${data.id}`}>{data.filename}</div>,
}));

vi.mock('@/shared/components', () => ({
  ButtonLink: ({ children, ...props }: Partial<ButtonLinkProps>) => <a {...props}>{children}</a>,
  Button: ({ children, ...props }: Partial<ButtonProps>) => <button {...props}>{children}</button>,
  Container: ({ children }: Partial<ContainerProps>) => <div>{children}</div>,
}));

describe('Компонент History', () => {
  test('рендерит секцию и контейнер', () => {
    // действие
    const { getByTestId } = render(<History />);

    // проверка
    expect(getByTestId('history-section')).toBeInTheDocument();
    expect(getByTestId('history-wrapper')).toBeInTheDocument();
  });

  test('отображает сообщение "История пуста", если логов нет', () => {
    // подготовка
    mockUseHistoryStore.mockReturnValue({ logs: [], clear: mockClear });

    // действие
    const { getByTestId } = render(<History />);

    // проверка
    expect(getByTestId('history-empty')).toHaveTextContent('История пуста');
  });

  test('не отображает кнопку "Очистить всё", если логов нет', () => {
    // подготовка
    mockUseHistoryStore.mockReturnValue({ logs: [], clear: mockClear });

    // действие
    const { queryByTestId } = render(<History />);

    // проверка
    expect(queryByTestId('history-clear-btn')).toBeNull();
  });

  test('рендерит список истории, если есть логи', () => {
    // подготовка
    const mockLogs: StatisticLog[] = [
      {
        id: '1',
        filename: 'file1.csv',
        date: '2023-04-05',
        stats: null,
      },
      {
        id: '2',
        filename: 'file2.csv',
        date: '2023-04-06',
        stats: null,
      },
    ];
    mockUseHistoryStore.mockReturnValue({ logs: mockLogs, clear: mockClear });

    // действие
    const { getByTestId } = render(<History />);

    // проверка
    expect(getByTestId('history-list')).toBeInTheDocument();
    expect(getByTestId('history-row-1')).toBeInTheDocument();
    expect(getByTestId('history-row-2')).toBeInTheDocument();
    expect(getByTestId('history-row-content-1')).toHaveTextContent('file1.csv');
    expect(getByTestId('history-row-content-2')).toHaveTextContent('file2.csv');
  });

  test('отображает кнопку "Очистить всё", если есть логи', () => {
    // подготовка
    const mockLogs: StatisticLog[] = [
      {
        id: '1',
        filename: 'file1.csv',
        date: '2023-04-05',
        stats: null,
      },
    ];
    mockUseHistoryStore.mockReturnValue({ logs: mockLogs, clear: mockClear });

    // действие
    const { getByTestId } = render(<History />);

    // проверка
    expect(getByTestId('history-clear-btn')).toBeInTheDocument();
  });

  test('вызывает clear при клике на кнопку "Очистить всё"', async () => {
    // подготовка
    const mockLogs: StatisticLog[] = [
      {
        id: '1',
        filename: 'file1.csv',
        date: '2023-04-05',
        stats: null,
      },
    ];
    mockUseHistoryStore.mockReturnValue({ logs: mockLogs, clear: mockClear });

    const { getByTestId } = render(<History />);
    const clearButton = getByTestId('history-clear-btn');

    // действие
    await userEvent.click(clearButton);

    // проверка
    expect(mockClear).toHaveBeenCalled();
  });

  test('отображает ссылку "Сгенерировать больше"', () => {
    // действие
    const { getByTestId } = render(<History />);

    // проверка
    const buttonLink = getByTestId('history-button-link');
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink).toHaveTextContent('Сгенерировать больше');
  });
});
