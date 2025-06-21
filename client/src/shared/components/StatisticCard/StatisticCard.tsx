import { memo, type FC } from 'react';
import styles from './StatisticCard.module.css';

type StatisticCardProps = {
  value: string;
  description: string;
  secondary?: boolean;
};

const StatisticCard: FC<StatisticCardProps> = ({ value, description, secondary }) => {
  const classNames = styles['statistic-card'] + (secondary === true ? ` ${styles['statistic-card--secondary']}` : '');

  return (
    <div className={classNames}>
      <span className={styles['statistic-card__value']}>{value}</span>
      <span className={styles['statistic-card__desc']}>{description}</span>
    </div>
  );
};

export default memo(StatisticCard);
