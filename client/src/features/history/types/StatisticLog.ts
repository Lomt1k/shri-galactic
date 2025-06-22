import { isStatistic, type Statistic } from '@/shared/types';

export type StatisticLog = {
  id: string;
  filename: string;
  date: string;
  stats: Statistic | null;
};

export const isStatisticLog = (obj: unknown): obj is StatisticLog => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'string' &&
    'filename' in obj &&
    typeof obj.filename === 'string' &&
    'date' in obj &&
    typeof obj.date === 'string' &&
    'stats' in obj &&
    (obj.stats === null || isStatistic(obj.stats))
  );
};
