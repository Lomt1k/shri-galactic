import { describe, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Компонент Modal', () => {
  const mockOnClickClose = vi.fn();

  const defaultProps = {
    onClickClose: mockOnClickClose,
    children: <div data-testid="test-content">Тестовое содержимое</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('рендерит содержимое внутри portal', () => {
    // действие
    const { getByTestId } = render(<Modal {...defaultProps} />);

    // проверка
    expect(getByTestId('test-content')).toBeInTheDocument();
  });

  test('вызывает onClickClose при клике на фон', async () => {
    // подготовка
    const { getByTestId } = render(<Modal {...defaultProps} />);
    const modalElement = getByTestId('modal');

    // действие
    await userEvent.click(modalElement);

    // проверка
    expect(mockOnClickClose).toHaveBeenCalledTimes(1);
  });

  test('вызывает onClickClose при клике на кнопку закрытия', async () => {
    // подготовка
    const { getByTestId } = render(<Modal {...defaultProps} />);
    const closeButton = getByTestId('modal__close');

    // действие
    await userEvent.click(closeButton);

    // проверка
    expect(mockOnClickClose).toHaveBeenCalledTimes(1);
  });

  test('не вызывает onClickClose при клике на контент', async () => {
    // подготовка
    const { getByTestId } = render(<Modal {...defaultProps} />);
    const contentElement = getByTestId('test-content');

    // действие
    await userEvent.click(contentElement);

    // проверка
    expect(mockOnClickClose).not.toHaveBeenCalled();
  });
});
