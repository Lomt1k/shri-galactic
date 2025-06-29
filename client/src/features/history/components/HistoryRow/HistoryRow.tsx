import styles from './HistoryRow.module.css';
import { useState, type FC } from 'react';
import type { StatisticLog } from '../../types';
import { useHistoryStore } from '../../store/HistoryStore';
import { IconBasket, IconEmojiSad, IconEmojiSmile, IconFile } from '@/shared/icons';
import { Modal, StatisticCardList } from '@/shared/components';

export type HistoryRowProps = {
  data: StatisticLog;
};

const getTextClassNames = (isActive: boolean) => {
  return styles['history-row__text'] + (isActive ? '' : ` ${styles['history-row__text--secondary']}`);
};

const HistoryRow: FC<HistoryRowProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const { remove } = useHistoryStore();

  return (
    <div data-testid="history-row" className={styles['history-row']}>
      <button
        data-testid="history-row-content"
        className={styles['history-row__content']}
        type="button"
        onClick={() => setShowModal(true)}
      >
        <span data-testid="history-row-filename" className={styles['history-row__text']}>
          <IconFile />
          {data.filename}
        </span>
        <span data-testid="history-row-date" className={styles['history-row__text']}>
          {data.date}
        </span>
        <span data-testid="history-row-success" className={getTextClassNames(!!data.stats)}>
          Обработан успешно
          <IconEmojiSmile />
        </span>
        <span data-testid="history-row-error" className={getTextClassNames(!data.stats)}>
          Не удалось обработать
          <IconEmojiSad />
        </span>
      </button>
      <button
        data-testid="history-row-remove-btn"
        className={styles['history-row__remove-btn']}
        aria-label="Удалить"
        type="button"
        onClick={() => remove(data.id)}
      >
        <IconBasket />
      </button>
      {showModal && data.stats && (
        <Modal
          data-testid="history-row-modal"
          className={styles['history-row__modal']}
          onClickClose={() => setShowModal(false)}
        >
          <StatisticCardList data={data.stats} />
        </Modal>
      )}
      {showModal && !data.stats && (
        <Modal data-testid="history-row-modal-empty" onClickClose={() => setShowModal(false)}>
          <p className={styles['history-row__modal-empty']} data-testid="history-row-modal-empty-text">
            Не удалось обработать файл <br />
            {data.filename}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default HistoryRow;
