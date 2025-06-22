import type { Statistic } from '@/shared/types';
import styles from './StatisticCardList.module.css';
import { useMemo, type FC } from 'react';
import StatisticCard from '../StatisticCard/StatisticCard';
import { getDayOfMonthString } from '@/shared/utils/dateHelper';

type StatisticCardListProps = {
  data: Statistic;
  columns?: boolean;
};

type RowData = [description: string, value: string];

const prepareRows = (data: Statistic): RowData[] => {
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

const StatisticCardList: FC<StatisticCardListProps> = ({ data, columns }) => {
  const classNames = styles['statistic-card-list'] + (columns ? ` ${styles['statistic-card-list--grid']}` : '');
  const rowDatas: RowData[] = useMemo(() => prepareRows(data), [data]);

  return (
    <ul className={classNames}>
      {rowDatas.map(([description, value]) => (
        <li key={description}>
          <StatisticCard secondary={columns} value={value} description={description} />
        </li>
      ))}
    </ul>
  );
};

export default StatisticCardList;
