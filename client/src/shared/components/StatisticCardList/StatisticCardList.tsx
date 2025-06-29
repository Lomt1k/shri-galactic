import type { Statistic } from '@/shared/types';
import styles from './StatisticCardList.module.css';
import { useMemo, type FC } from 'react';
import { StatisticCard } from '@/shared/components';
import { prepareRows } from '@/shared/components/StatisticCardList/prepareRows.ts';

export type StatisticCardListProps = {
  data: Statistic;
  columns?: boolean;
};

export type RowData = [description: string, value: string];

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
