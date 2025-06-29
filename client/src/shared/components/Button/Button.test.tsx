import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Компонент Button', () => {
  test('рендерит кнопку с текстом', () => {
    // подготовка
    const { getByTestId } = render(<Button>Текст</Button>);
    const buttonElement = getByTestId('button');

    // действие
    expect(buttonElement).toHaveTextContent('Текст');
  });

  test('вызывает onClick при клике на кнопку', async () => {
    // подготовка
    const mockOnClick = vi.fn();
    const { getByTestId } = render(<Button onClick={mockOnClick}>Кликни меня</Button>);
    const buttonElement = getByTestId('button');

    // действие
    await userEvent.click(buttonElement);

    // проверка
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('имеет type="submit", если submit={true}', () => {
    // действие
    const { getByTestId } = render(<Button submit={true}>Отправить</Button>);
    const buttonElement = getByTestId('button') as HTMLButtonElement;

    // проверка
    expect(buttonElement.type).toBe('submit');
  });

  test('имеет type="button", если не прокинут submit', () => {
    // действие
    const { getByTestId } = render(<Button submit={false}>Нажми</Button>);
    const buttonElement = getByTestId('button') as HTMLButtonElement;

    // проверка
    expect(buttonElement.type).toBe('button');
  });

  test('прокидывает дополнительные props через rest', () => {
    // действие
    const { getByTestId } = render(
      <Button data-testid="custom-button" aria-label="важная кнопка">
        Кнопка
      </Button>
    );
    const buttonElement = getByTestId('custom-button');

    // проверка
    expect(buttonElement).toHaveAttribute('aria-label', 'важная кнопка');
  });
});
