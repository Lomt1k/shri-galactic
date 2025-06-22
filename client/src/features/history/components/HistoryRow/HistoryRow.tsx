import styles from './HistoryRow.module.css';
import { useState, type FC } from 'react';
import type { StatisticLog } from '../../types';
import { useHistoryState } from '../../store/HistoryStore';
import { IconBasket, IconEmojiSad, IconEmojiSmile, IconFile } from '@/shared/icons';
import { Modal, StatisticCardList } from '@/shared/components';

type HistoryRowProps = {
  data: StatisticLog;
};

const getTextClassNames = (isActive: boolean) => {
  return styles['history-row__text'] + (isActive ? '' : ` ${styles['history-row__text--secondary']}`);
};

const HistoryRow: FC<HistoryRowProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const { remove } = useHistoryState();

  return (
    <div className={styles['history-row']}>
      <button className={styles['history-row__content']} type="button" onClick={() => setShowModal(true)}>
        <span className={styles['history-row__text']}>
          <IconFile />
          {data.filename}
        </span>
        <span className={styles['history-row__text']}>{data.date}</span>
        <span className={getTextClassNames(!!data.stats)}>
          Обработан успешно
          <IconEmojiSmile />
        </span>
        <span className={getTextClassNames(!data.stats)}>
          Не удалось обработать
          <IconEmojiSad />
        </span>
      </button>
      <button
        className={styles['history-row__remove-btn']}
        aria-label="Удалить"
        type="button"
        onClick={() => remove(data.id)}
      >
        <IconBasket />
      </button>
      {showModal && data.stats && (
        <Modal className={styles['history-row__modal']} onClickClose={() => setShowModal(false)}>
          <StatisticCardList data={data.stats} />
        </Modal>
      )}
      {showModal && !data.stats && (
        <Modal onClickClose={() => setShowModal(false)}>
          <p className={styles['history-row__modal-empty']}>
            Не удалось обработать файл <br />
            {data.filename}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default HistoryRow;
