export type Statistic = {
  total_spend_galactic: number;
  average_spend_galactic: number;
  rows_affected: number;
  big_spent_at?: number;
  big_spent_civ?: string;
  big_spent_value?: number;
  less_spent_at?: number;
  less_spent_civ?: string;
  less_spent_value?: number;
};

export const isStatistic = (obj: unknown): obj is Statistic => {
  const checkRequired =
    obj !== null &&
    typeof obj === 'object' &&
    'total_spend_galactic' in obj &&
    typeof obj.total_spend_galactic === 'number' &&
    'average_spend_galactic' in obj &&
    typeof obj.average_spend_galactic === 'number' &&
    'rows_affected' in obj &&
    typeof obj.rows_affected === 'number';

  if (!checkRequired) return false;

  return (
    (!('big_spent_at' in obj) || typeof obj.big_spent_at === 'number') &&
    (!('big_spent_civ' in obj) || typeof obj.big_spent_civ === 'string') &&
    (!('big_spent_value' in obj) || typeof obj.big_spent_value === 'number') &&
    (!('less_spent_at' in obj) || typeof obj.less_spent_at === 'number') &&
    (!('less_spent_civ' in obj) || typeof obj.less_spent_civ === 'string') &&
    (!('less_spent_value' in obj) || typeof obj.less_spent_value === 'number')
  );
};
