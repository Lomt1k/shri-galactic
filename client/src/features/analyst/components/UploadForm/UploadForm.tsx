import styles from './UploadForm.module.css';
import { useCallback, useState, type FC, useRef, memo } from 'react';
import { Button, StatisticCardList, UploadButton } from '@/shared/components';
import { fetchAggregate } from '../../api';
import type { Statistic } from '@/shared/types';

const UploadForm: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<string>();
  const [stats, setStats] = useState<Statistic>();
  const formRef = useRef<HTMLFormElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading || isLoaded) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading || isLoaded) return;
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    onFileChanged(droppedFile);
  };

  const onFileChanged = useCallback((file: File | null) => {
    setFile(file);
    if (!file) {
      setIsError(false);
      setIsLoaded(false);
      setIsLoading(false);
      setMessage(undefined);
      setStats(undefined);
      return;
    }
    const correctFile = file.name.endsWith('.csv');
    setIsError(!correctFile);
    setMessage(correctFile ? 'Файл загружен' : 'упс, не то...');
  }, []);

  const onReset = useCallback(() => {
    formRef.current?.reset();
    onFileChanged(null);
  }, [onFileChanged]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setMessage('идёт парсинг файла');
    try {
      const stats = await fetchAggregate(file, setStats);
      setIsLoading(false);
      setIsLoaded(true);
      setMessage('готово!');
      setStats(stats);
      // TODO: add stats to history
    } catch (error: unknown) {
      setMessage(error!.toString());
      setIsLoading(false);
      setIsError(true);
    }
  };

  const classNames =
    styles['upload-form'] +
    (isDragging
      ? ` ${styles['upload-form--dragging']}`
      : isError
        ? ` ${styles['upload-form--error']}`
        : file
          ? ` ${styles['upload-form--result']}`
          : '');

  return (
    <div className={classNames}>
      <form className={styles['upload-form__form']} onSubmit={onSubmit} ref={formRef}>
        <p className={styles['upload-form__desc']}>
          Загрузите <b>csv</b> и получите <b>полную информацию</b> о нём за сверхнизкое время
        </p>
        <div
          ref={dropZoneRef}
          className={styles['upload-form__dropzone']}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadButton
            isLoading={isLoading}
            isLoaded={isLoaded}
            isError={isError}
            result={file?.name}
            message={message}
            onReset={onReset}
            onFileChanged={onFileChanged}
          />
        </div>
        {!isError && !isLoading && !isLoaded && (
          <Button submit disabled={!file}>
            Отправить
          </Button>
        )}
      </form>
      {!stats && (
        <span className={styles['upload-form__no-stats']}>
          Здесь
          <br />
          появятся хайлайты
        </span>
      )}
      {stats && <StatisticCardList columns data={stats} />}
    </div>
  );
};

export default memo(UploadForm);
