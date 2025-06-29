import { type FC } from 'react';
import styles from './Analyst.module.css';
import { Container } from '@/shared/components';
import { UploadForm } from '..';

const Analyst: FC = () => {
  return (
    <section className={styles.analyst}>
      <h1 className="visually-hidden">CSV Аналитик</h1>
      <Container grow>
        <UploadForm />
      </Container>
    </section>
  );
};

export default Analyst;
