import styles from './UploadForm.module.css';
import { useCallback, useState, type FC, useRef, memo } from 'react';
import { Button, StatisticCardList, UploadButton } from '@/shared/components';
import { fetchAggregate } from '../../api';
import type { Statistic } from '@/shared/types';
import { useHistoryStore } from '@/features/history/store/HistoryStore';
import { subscribeBeforeUnload } from '@/shared/utils/subscribeBeforeUnload';

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
  const { add: addStatisticToHistory } = useHistoryStore();

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
    const unsubscribeBeforeUnload = subscribeBeforeUnload();
    try {
      const stats = await fetchAggregate(file, setStats);
      setIsLoading(false);
      setIsLoaded(true);
      setMessage('готово!');
      setStats(stats);
      addStatisticToHistory(stats, file.name);
    } catch (error: unknown) {
      setMessage(error!.toString());
      setIsLoading(false);
      setIsError(true);
      addStatisticToHistory(null, file.name);
    } finally {
      unsubscribeBeforeUnload();
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
          data-testid="upload-form__dropzone"
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
