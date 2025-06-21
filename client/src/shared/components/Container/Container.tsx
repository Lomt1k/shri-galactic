import styles from './Container.module.css';
import type { FC, ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  grow?: boolean;
};

const Container: FC<ContainerProps> = ({ children, grow }) => {
  return <div className={styles.container + (grow === true ? ` ${styles['container--grow']}` : '')}>{children}</div>;
};

export default Container;
