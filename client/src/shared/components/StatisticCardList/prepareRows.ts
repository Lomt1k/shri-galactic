import type { RowData } from '@/shared/components/StatisticCardList/StatisticCardList.tsx';
import type { Statistic } from '@/shared/types';
import { getDayOfMonthString } from '@/shared/utils/dateHelper.ts';

export const prepareRows = (data: Statistic): RowData[] => {
  const result: RowData[] = [];
  const rounded = (value: number) => Math.round(value).toString();

  result.push(['Общие расходы в галактических кредитах', rounded(data.total_spend_galactic)]);
  result.push(['Количество обработанных записей', rounded(data.rows_affected)]);
  if (data.less_spent_at) result.push(['День года с минимальными расходами', getDayOfMonthString(data.less_spent_at)]);
  if (data.big_spent_civ) result.push(['Цивилизация с максимальными расходами', data.big_spent_civ]);
  if (data.less_spent_civ) result.push(['Цивилизация с минимальными расходами', data.less_spent_civ]);
  if (data.big_spent_at) result.push(['День года с максимальными расходами', getDayOfMonthString(data.big_spent_at)]);
  if (data.big_spent_value) result.push(['Максимальная сумма расходов за день', rounded(data.big_spent_value)]);
  result.push(['Средние расходы в галактических кредитах', rounded(data.average_spend_galactic)]);

  return result;
};
