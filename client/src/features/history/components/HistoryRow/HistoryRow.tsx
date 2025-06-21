import styles from './HistoryRow.module.css';
import type { FC } from 'react';
import type { StatisticLog } from '../../types';
import { useHistoryState } from '../../store/HistoryStore';

type HistoryRowProps = {
  data: StatisticLog;
};

const HistoryRow: FC<HistoryRowProps> = ({ data }) => {
  const { remove } = useHistoryState();

  return (
    <div className={styles['history-row']}>
      <button className={styles['history-row__content']}>
        <span>{data.filename}</span>
        <span>{data.date}</span>
        <span>Обработан успешно</span>
        <span>Не удалось обработать</span>
      </button>
      <button type="button" onClick={() => remove(data.id)}>
        УДАЛИТЬ
      </button>
    </div>
  );
};

export default HistoryRow;
