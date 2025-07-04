import { memo, useRef, type ChangeEventHandler, type FC } from 'react';
import styles from './UploadButton.module.css';
import { IconCancel } from '@/shared/icons';
import { Loader } from '@/shared/components';

export type UploadButtonProps = {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  result?: string;
  message?: string;
  onReset?: () => void;
  onFileChanged?: (file: File | null) => void;
};

const UploadButton: FC<UploadButtonProps> = ({
  isLoading,
  isLoaded,
  isError,
  result,
  message,
  onReset,
  onFileChanged,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileChanged) onFileChanged(file);
  };

  const classNames =
    styles['upload-button'] +
    (isError ? ` ${styles['upload-button--error']}` : '') +
    (isLoading ? ` ${styles['upload-button--loading']}` : '') +
    (isLoaded ? ` ${styles['upload-button--loaded']}` : '') +
    (result ? ` ${styles['upload-button--result']}` : '');

  return (
    <div className={classNames}>
      <input
        data-testid="upload-btn-file-input"
        className={styles['upload-button__input']}
        type="file"
        accept=".csv"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div className={styles['upload-button__content']}>
        <button
          data-testid="upload-btn"
          className={styles['upload-button__btn']}
          type="button"
          disabled={!!result || isLoading}
          onClick={() => inputRef.current?.click()}
        >
          {isLoading ? <Loader data-testid="upload-btn-loader" /> : (result ?? 'Загрузить файл')}
        </button>
        {result && !isLoading && (
          <button
            data-testid="upload-btn-reset"
            className={styles['upload-button__reset']}
            type="button"
            onClick={onReset}
          >
            <IconCancel />
          </button>
        )}
      </div>
      <span data-testid="upload-btn-message" className={styles['upload-button__message']}>
        {message ?? 'или перетащите сюда'}
      </span>
    </div>
  );
};

export default memo(UploadButton);
