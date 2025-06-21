import { memo, type ButtonHTMLAttributes, type FC, type ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  submit?: boolean;
  secondary?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, onClick, submit, secondary, ...rest }) => {
  const classNames = styles.button + (secondary === true ? ` ${styles['button--secondary']}` : '');

  return (
    <button className={classNames} onClick={onClick} type={submit === true ? 'submit' : 'button'} {...rest}>
      {children}
    </button>
  );
};

export default memo(Button);
