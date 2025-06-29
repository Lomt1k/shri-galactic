import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import StatisticCard from './StatisticCard';

describe('Компонент StatisticCard', () => {
  test('отображает значение и описание корректно', () => {
    // подготовка
    const defaultProps = {
      value: '42',
      description: 'Total Users',
    };

    // действие
    const { getByTestId } = render(<StatisticCard {...defaultProps} />);

    // проверка
    expect(getByTestId('statistic-card__value')).toHaveTextContent('42');
    expect(getByTestId('statistic-card__description')).toHaveTextContent('Total Users');
  });
});
