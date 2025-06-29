import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Generator from './Generator';
import type { ButtonProps, UploadButtonProps } from '@/shared/components';
import type { ReactNode } from 'react';

vi.mock('@/shared/components', () => ({
  Button: ({ children, ...props }: Partial<ButtonProps>) => <button {...props}>{children}</button>,
  UploadButton: (props: Partial<UploadButtonProps>) => (
    <div>
      <button {...props}>UPLOAD</button>
      <span data-testid="message-mock">{props.message}</span>
    </div>
  ),
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../api', () => ({
  fetchReport: vi.fn(),
}));

vi.mock('@/shared/utils/downloadHelper', () => ({
  downloadBlob: vi.fn(),
}));

describe('Компонент Generator', () => {
  test('рендерит основной интерфейс и текст', () => {
    // действие
    const { getByTestId } = render(<Generator />);
    const wrapper = getByTestId('generator-wrapper');

    // проверка
    expect(wrapper).toBeInTheDocument();
    expect(getByTestId('generator-text')).toHaveTextContent('Сгенерируйте готовый csv-файл нажатием одной кнопки');
  });

  test('отображает кнопку "Начать генерацию" при начальном состоянии', () => {
    // действие
    const { getByTestId } = render(<Generator />);
    const button = getByTestId('generator-button');

    // проверка
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Начать генерацию');
  });

  test('при клике на кнопку вызывает fetchReport и отображает UploadButton', async () => {
    // подготовка
    const mockFetchReport = vi.mocked(await import('../../api')).fetchReport;
    mockFetchReport.mockResolvedValueOnce(new Blob());
    const { getByTestId } = render(<Generator />);
    const button = getByTestId('generator-button');

    // действие
    await userEvent.click(button);

    // проверка
    expect(mockFetchReport).toHaveBeenCalled();
    expect(getByTestId('generator-upload-button')).toBeInTheDocument();
  });

  test('показывает "файл сгенерирован!" после успешной загрузки', async () => {
    // подготовка
    const mockFetchReport = vi.mocked(await import('../../api')).fetchReport;
    mockFetchReport.mockResolvedValueOnce(new Blob());
    const { getByTestId } = render(<Generator />);
    const button = getByTestId('generator-button');

    // действие
    await userEvent.click(button);

    // проверка
    const messageEl = getByTestId('message-mock');
    expect(messageEl).toHaveTextContent('файл сгенерирован!');
  });

  test('вызывает скачивание файла (downloadBlob) с полученным blob и именем файла', async () => {
    // подготовка
    const mockFetchReport = vi.mocked(await import('../../api')).fetchReport;
    const mockDownloadBlob = vi.mocked(await import('@/shared/utils/downloadHelper')).downloadBlob;

    const fakeBlob = new Blob();
    mockFetchReport.mockResolvedValueOnce(fakeBlob);

    const { getByTestId } = render(<Generator />);
    const button = getByTestId('generator-button');

    // действие
    await userEvent.click(button);

    // проверка
    expect(mockDownloadBlob).toHaveBeenCalledWith(fakeBlob, 'report.csv');
  });

  test('показывает ошибку при неудачном запросе', async () => {
    // подготовка
    const mockFetchReport = vi.mocked(await import('../../api')).fetchReport;
    mockFetchReport.mockRejectedValueOnce(new Error('Network error'));
    const { getByTestId } = render(<Generator />);
    const button = getByTestId('generator-button');

    // действие
    await userEvent.click(button);

    // проверка
    const messageEl = getByTestId('message-mock');
    expect(messageEl).toHaveTextContent('Error: Network error');
  });
});
