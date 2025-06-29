import type { FC } from 'react';
import styles from './Loader.module.css';

type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

const Loader: FC<LoaderProps> = (props) => {
  return <div className={styles.loader} {...props}></div>;
};

export default Loader;
