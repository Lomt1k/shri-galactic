import { prepareRows } from './prepareRows';
import type { Statistic } from '@/shared/types';

describe('Функция prepareRows', () => {
  test('возвращает правильные строки данных при наличии всех опциональных полей', () => {
    const data: Statistic = {
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

    const result = prepareRows(data);

    expect(result).toEqual([
      ['Общие расходы в галактических кредитах', '100500'],
      ['Количество обработанных записей', '2236'],
      ['День года с минимальными расходами', '26 апреля'],
      ['Цивилизация с максимальными расходами', 'Galactic Empire'],
      ['Цивилизация с минимальными расходами', 'Rebel Alliance'],
      ['День года с максимальными расходами', '4 мая'],
      ['Максимальная сумма расходов за день', '99999'],
      ['Средние расходы в галактических кредитах', '123'],
    ]);
  });

  test('возвращает строки без опциональных полей, если они отсутствуют', () => {
    const data: Statistic = {
      total_spend_galactic: 100500,
      average_spend_galactic: 123.45,
      rows_affected: 2236,
    };

    const result = prepareRows(data);

    expect(result).toEqual([
      ['Общие расходы в галактических кредитах', '100500'],
      ['Количество обработанных записей', '2236'],
      ['Средние расходы в галактических кредитах', '123'],
    ]);
  });

  test('округляет числа до целых', () => {
    const data: Statistic = {
      total_spend_galactic: 100.4,
      average_spend_galactic: 123.6,
      rows_affected: 2236,
    };

    const result = prepareRows(data);

    expect(result).toEqual([
      ['Общие расходы в галактических кредитах', '100'],
      ['Количество обработанных записей', '2236'],
      ['Средние расходы в галактических кредитах', '124'],
    ]);
  });
});
