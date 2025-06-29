import { render } from '@testing-library/react';
import { UploadButton, type UploadButtonProps } from '@/shared/components';
import { expect, describe, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const getDefaultProps = (): UploadButtonProps => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
});

describe('Компонент UploadButton', () => {
  test('по умолчанию рендерится с текстом "Загрузить файл"', () => {
    // подготовка
    const props = getDefaultProps();

    // действие
    const { getByTestId } = render(<UploadButton {...props} />);

    // проверка
    expect(getByTestId('upload-btn').textContent).toBe('Загрузить файл');
  });
  test('если прокинут пропс isLoading, то отображается лоадер', () => {
    // подготовка
    const props = { ...getDefaultProps(), isLoading: true };

    // действие
    const { getByTestId } = render(<UploadButton {...props} />);

    // проверка
    expect(getByTestId('upload-btn-loader')).toBeInTheDocument();
  });
  test('если прокинут текст в пропс message, то это сообщение отображается под кнопкой', () => {
    // подготовка
    const props = { ...getDefaultProps(), message: 'Привет, мир!' };

    // действие
    const { getByTestId } = render(<UploadButton {...props} />);

    // проверка
    expect(getByTestId('upload-btn-message').textContent).toBe('Привет, мир!');
  });
  test('если прокинут текст в пропс result, то он отображается на кнопке', () => {
    // подготовка
    const props = { ...getDefaultProps(), result: 'data.csv' };

    // действие
    const { getByTestId } = render(<UploadButton {...props} />);

    // проверка
    expect(getByTestId('upload-btn').textContent).toBe('data.csv');
  });
  test('при нажатии на кнопку сброса вызывается пропс onReset', async () => {
    // подготовка
    const props = { ...getDefaultProps(), result: 'file.txt', onReset: vi.fn() };

    // действие
    const { getByTestId } = render(<UploadButton {...props} />);
    const resetBtn = getByTestId('upload-btn-reset');
    await userEvent.click(resetBtn);

    // проверка
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });
  test('если прокинут пропс result, то кнопка неактивна', async () => {
    // подготовка
    const props = { ...getDefaultProps(), result: 'data.csv' };
    const { getByTestId } = render(<UploadButton {...props} />);
    const uploadBtn = getByTestId('upload-btn');
    uploadBtn.onclick = vi.fn();

    // действие
    await userEvent.click(uploadBtn);

    // проверка
    expect(uploadBtn.onclick).not.toHaveBeenCalled();
  });
  test('если прокинут пропс isLoading, то кнопка неактивна', async () => {
    // подготовка
    const props = { ...getDefaultProps(), isLoading: true };
    const { getByTestId } = render(<UploadButton {...props} />);
    const uploadBtn = getByTestId('upload-btn');
    uploadBtn.onclick = vi.fn();

    // действие
    await userEvent.click(uploadBtn);

    // проверка
    expect(uploadBtn.onclick).not.toHaveBeenCalled();
  });
  test('при клике по кнопке симулируется клик по файловому инпуту', async () => {
    // подготовка
    const props = getDefaultProps();
    const { getByTestId } = render(<UploadButton {...props} />);
    const uploadBtn = getByTestId('upload-btn');
    const fileInput = getByTestId('upload-btn-file-input');
    const mockFileInputClick = vi.fn();
    fileInput.onclick = mockFileInputClick;

    // действие
    await userEvent.click(uploadBtn);

    // проверка
    expect(mockFileInputClick).toHaveBeenCalled();
  });

  test('при выборе файла вызывается пропс onFileChanged', async () => {
    // подготовка
    const mockOnFileChanged = vi.fn();
    const props = { ...getDefaultProps(), onFileChanged: mockOnFileChanged };
    const { getByTestId } = render(<UploadButton {...props} />);
    const fileInput = getByTestId('upload-btn-file-input');
    const file = new File(['(⌐□_□)'], 'test.csv', { type: 'text/csv' });

    // действие
    await userEvent.upload(fileInput, file);

    // проверка
    expect(mockOnFileChanged).toHaveBeenCalledTimes(1);
    expect(mockOnFileChanged).toHaveBeenCalledWith(file);
  });
});
