import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, test, vi, beforeEach } from 'vitest';
import UploadForm from './UploadForm';
import type { Statistic } from '@/shared/types';
import type { StatisticCardListProps, UploadButtonProps } from '@/shared/components';

const mockAddStatisticToHistory = vi.fn();
const mockFetchAggregate = vi.fn();

let uploadFilename = 'test.csv';
vi.mock('@/shared/components/UploadButton', () => ({
  UploadButton: ({ onFileChanged, message }: Partial<UploadButtonProps>) => (
    <div>
      <button
        data-testid="upload-btn-mock"
        onClick={() => {
          const file = new File(['data'], uploadFilename);
          onFileChanged?.(file);
        }}
      >
        <span data-testid="message-mock">{message ?? 'Загрузить файл'}</span>
      </button>
    </div>
  ),
}));

vi.mock('@/shared/components/StatisticCardList', () => ({
  StatisticCardList: ({ data }: Partial<StatisticCardListProps>) => (
    <div data-testid="statistic-card-list-mock">{JSON.stringify(data)}</div>
  ),
}));

beforeAll(async () => {
  const historyStore = await import('@/features/history/store/HistoryStore');
  const api = await import('../../api');

  vi.spyOn(historyStore, 'useHistoryStore').mockReturnValue({
    add: mockAddStatisticToHistory,
  });

  vi.spyOn(api, 'fetchAggregate').mockImplementation(mockFetchAggregate);
});

describe('Компонент UploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('рендерится и отображает кнопку загрузки', () => {
    // подготовка
    uploadFilename = 'test.csv';

    // действие
    const { getByTestId } = render(<UploadForm />);

    // проверка
    expect(getByTestId('upload-btn-mock')).toBeInTheDocument();
  });

  test('отображает сообщение об ошибке при загрузке неподходящего файла', async () => {
    // подготовка
    uploadFilename = 'cat.jpg';
    const { getByTestId } = render(<UploadForm />);

    // действие
    await userEvent.click(getByTestId('upload-btn-mock'));

    // проверка
    const message = getByTestId('message-mock');
    expect(message).toHaveTextContent('упс, не то...');
  });

  test('отображает сообщение "Файл загружен" при загрузке CSV', async () => {
    // подготовка
    uploadFilename = 'test.csv';
    const { getByTestId } = render(<UploadForm />);

    // действие
    await userEvent.click(getByTestId('upload-btn-mock'));

    // проверка
    const message = getByTestId('message-mock');
    expect(message).toHaveTextContent('Файл загружен');
  });

  test('при клике на кнопку "Отправить" вызывается fetchAggregate', async () => {
    // подготовка
    uploadFilename = 'test.csv';
    const { getByTestId, getByRole } = render(<UploadForm />);

    // действие
    await userEvent.click(getByTestId('upload-btn-mock'));
    const submitButton = getByRole('button', { name: /отправить/i });
    await userEvent.click(submitButton);

    // проверка
    expect(mockFetchAggregate).toHaveBeenCalled();
  });

  test('отображает статистику после успешной загрузки', async () => {
    // подготовка
    uploadFilename = 'test.csv';
    const mockStats: Statistic = {
      total_spend_galactic: 100500,
      average_spend_galactic: 123,
      rows_affected: 2236,
    };
    mockFetchAggregate.mockResolvedValueOnce(mockStats);

    // действие
    const { getByTestId, getByRole } = render(<UploadForm />);
    await userEvent.click(getByTestId('upload-btn-mock'));
    const submitButton = getByRole('button', { name: /отправить/i });
    await userEvent.click(submitButton);

    // проверка
    const cardList = getByTestId('statistic-card-list-mock');
    expect(cardList).toBeInTheDocument();
    expect(cardList).toHaveTextContent(JSON.stringify(mockStats));
  });

  test('сохраняет статистику в историю', async () => {
    // подготовка
    uploadFilename = 'test.csv';
    const mockStats: Statistic = {
      total_spend_galactic: 100500,
      average_spend_galactic: 123,
      rows_affected: 2236,
    };
    mockFetchAggregate.mockResolvedValueOnce(mockStats);

    // действие
    const { getByTestId, getByRole } = render(<UploadForm />);
    await userEvent.click(getByTestId('upload-btn-mock'));
    const submitButton = getByRole('button', { name: /отправить/i });
    await userEvent.click(submitButton);

    // проверка
    expect(mockAddStatisticToHistory).toHaveBeenCalledWith(mockStats, uploadFilename);
  });

  test('отображает ошибку при провале fetchAggregate', async () => {
    // подготовка
    uploadFilename = 'test.csv';
    mockFetchAggregate.mockRejectedValueOnce(new Error('Ошибка сервера'));

    // действие
    const { getByTestId, getByRole } = render(<UploadForm />);
    await userEvent.click(getByTestId('upload-btn-mock'));
    const submitButton = getByRole('button', { name: /отправить/i });
    await userEvent.click(submitButton);

    // проверка
    expect(getByTestId('message-mock')).toHaveTextContent(/ошибка/i);
  });

  test('отображает сообщение "Файл загружен" при загрузке CSV файла через Drag N Drop', async () => {
    const { getByTestId } = render(<UploadForm />);

    const dropZone = getByTestId('upload-form__dropzone');

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['valid data'], 'file.csv')],
      },
    });

    const message = getByTestId('message-mock');
    await waitFor(() => {
      expect(message).toHaveTextContent(/файл загружен/i);
    });
  });

  test('отображает сообщение об ошибке при загрузке неподходящего файла через Drag N Drop', async () => {
    const { getByTestId } = render(<UploadForm />);

    const dropZone = getByTestId('upload-form__dropzone');

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['valid data'], 'dog.gif')],
      },
    });

    const message = getByTestId('message-mock');
    await waitFor(() => {
      expect(message).toHaveTextContent(/упс, не то.../i);
    });
  });
});
