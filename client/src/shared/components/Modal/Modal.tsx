import type { FC, ReactNode } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';
import { IconCancel } from '@/shared/icons';

export type ModalProps = {
  children: ReactNode;
  onClickClose: () => void;
  className?: string;
};

const Modal: FC<ModalProps> = ({ children, onClickClose, className }) => {
  return createPortal(
    <div data-testid="modal" className={styles.modal} onClick={onClickClose}>
      <div className={styles.modal__area}>
        <div
          className={styles.modal__content + (className ? ` ${className}` : '')}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          <button
            data-testid="modal__close"
            className={styles.modal__close}
            type="button"
            onClick={onClickClose}
            aria-label="Закрыть окно"
          >
            <IconCancel />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
