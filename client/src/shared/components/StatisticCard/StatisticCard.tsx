import { memo, type FC } from 'react';
import styles from './StatisticCard.module.css';

export type StatisticCardProps = {
  value: string;
  description: string;
  secondary?: boolean;
};

const StatisticCard: FC<StatisticCardProps> = ({ value, description, secondary }) => {
  const classNames = styles['statistic-card'] + (secondary === true ? ` ${styles['statistic-card--secondary']}` : '');

  return (
    <div data-testid="statistic-card" className={classNames}>
      <span data-testid="statistic-card__value" className={styles['statistic-card__value']}>
        {value}
      </span>
      <span data-testid="statistic-card__description" className={styles['statistic-card__desc']}>
        {description}
      </span>
    </div>
  );
};

export default memo(StatisticCard);
