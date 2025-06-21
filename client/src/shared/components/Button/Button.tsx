import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  submit?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, onClick, submit, ...rest }) => {
  return (
    <button className={styles.button} onClick={onClick} type={submit === true ? 'submit' : 'button'} {...rest}>
      {children}
    </button>
  );
};

export default Button;
