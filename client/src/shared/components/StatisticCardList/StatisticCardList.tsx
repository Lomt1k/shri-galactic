import type { Statistic } from '@/shared/types';
import styles from './StatisticCardList.module.css';
import { useMemo, type FC } from 'react';
import StatisticCard from '../StatisticCard/StatisticCard';
import { getDayOfMonthString } from '@/utils/dateHelper';

type StatisticCardListProps = {
  data: Statistic;
  columns?: boolean;
};

type RowData = [string, string];

const prepareRows = (data: Statistic): RowData[] => {
  const result: RowData[] = [];

  result.push(['общие расходы в галактических кредитах', data.total_spend_galactic.toString()]);
  result.push(['количество обработанных записей', data.rows_affected.toString()]);
  if (data.less_spent_at) result.push(['день года с минимальными расходами', getDayOfMonthString(data.less_spent_at)]);
  if (data.big_spent_civ) result.push(['цивилизация с максимальными расходами', data.big_spent_civ.toString()]);
  if (data.less_spent_civ) result.push(['цивилизация с минимальными расходами', data.less_spent_civ.toString()]);
  if (data.big_spent_at) result.push(['день года с максимальными расходами', getDayOfMonthString(data.big_spent_at)]);
  if (data.big_spent_value) result.push(['максимальная сумма расходов за день', data.big_spent_value.toString()]);
  result.push(['средние расходы в галактических кредитах', data.average_spend_galactic.toString()]);

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
