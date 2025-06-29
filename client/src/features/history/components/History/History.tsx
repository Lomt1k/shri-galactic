import styles from './History.module.css';
import { type FC } from 'react';
import { Button, ButtonLink, Container } from '@/shared/components';
import { useHistoryStore } from '../../store/HistoryStore';
import { HistoryRow } from '../HistoryRow';

const History: FC = () => {
  const { logs, clear } = useHistoryStore();

  return (
    <section data-testid="history-section" className={styles.history}>
      <h1 className="visually-hidden">История межгалактической аналитики</h1>
      <Container>
        <div data-testid="history-wrapper" className={styles.history__wrapper}>
          <ul data-testid="history-list" className={styles.history__list}>
            {logs.map((log) => (
              <li key={log.id} data-testid={`history-row-${log.id}`}>
                <HistoryRow data={log} />
              </li>
            ))}
          </ul>
          {!logs.length && (
            <p data-testid="history-empty" className={styles.history__empty}>
              История пуста
            </p>
          )}
          <div data-testid="history-controls" className={styles.history__controls}>
            <ButtonLink data-testid="history-button-link" to="/generator">
              Сгенерировать больше
            </ButtonLink>
            {!!logs.length && (
              <Button data-testid="history-clear-btn" secondary onClick={clear}>
                Очистить всё
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default History;
