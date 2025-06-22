import styles from './History.module.css';
import { type FC } from 'react';
import { Button, ButtonLink, Container } from '@/shared/components';
import { useHistoryState } from '../../store/HistoryStore';
import { HistoryRow } from '../HistoryRow';

const History: FC = () => {
  const { logs, clear } = useHistoryState();

  return (
    <section className={styles.history}>
      <h1 className="visually-hidden">История межгалактической аналитики</h1>
      <Container>
        <div className={styles.history__wrapper}>
          <ul className={styles.history__list}>
            {logs.map((log) => (
              <li key={log.id}>
                <HistoryRow data={log} />
              </li>
            ))}
          </ul>
          {!logs.length && <p className={styles.history__empty}>История пуста</p>}
          <div className={styles.history__controls}>
            <ButtonLink to="/generator">Сгенерировать больше</ButtonLink>
            {!!logs.length && (
              <Button secondary onClick={clear}>
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
