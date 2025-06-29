import { useCallback, useState, type FC } from 'react';
import styles from './Generator.module.css';
import { Button, Container, UploadButton } from '@/shared/components';
import { fetchReport } from '../../api';
import { downloadBlob } from '@/shared/utils/downloadHelper';
import { subscribeBeforeUnload } from '@/shared/utils/subscribeBeforeUnload';

const Generator: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>();

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    const unsubscribeBeforeUnload = subscribeBeforeUnload();
    try {
      const blob = await fetchReport();
      downloadBlob(blob, 'report.csv');
      setIsLoading(false);
      setIsLoaded(true);
    } catch (error: unknown) {
      setIsLoading(false);
      setIsLoaded(false);
      setError(error!.toString());
    }
    unsubscribeBeforeUnload();
  }, []);

  const handleReset = useCallback(() => {
    setIsLoaded(false);
    setError(undefined);
  }, []);

  return (
    <section data-testid="generator-section">
      <h1 className="visually-hidden">CSV Генератор</h1>
      <Container>
        <div className={styles.generator__wrapper} data-testid="generator-wrapper">
          <p className={styles.generator__text} data-testid="generator-text">
            Сгенерируйте готовый csv-файл нажатием одной кнопки
          </p>
          {!isLoading && !isLoaded && !error && (
            <Button data-testid="generator-button" onClick={handleClick}>
              Начать генерацию
            </Button>
          )}
          {(isLoading || isLoaded || error) && (
            <UploadButton
              data-testid="generator-upload-button"
              isLoading={isLoading}
              isLoaded={isLoaded}
              isError={!!error}
              result={error ? 'Ошибка' : isLoaded ? 'Done!' : undefined}
              message={error ?? (isLoaded ? 'файл сгенерирован!' : 'идёт процесс генерации')}
              onReset={handleReset}
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default Generator;
