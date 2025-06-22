import { memo, type FC, type ReactNode } from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router';

type ButtonLinkProps = {
  children: ReactNode;
  to: string;
  secondary?: boolean;
};

const ButtonLink: FC<ButtonLinkProps> = ({ children, to, secondary }) => {
  const classNames = styles.button + (secondary === true ? ` ${styles['button--secondary']}` : '');

  return (
    <Link className={classNames} to={to}>
      {children}
    </Link>
  );
};

export default memo(ButtonLink);
