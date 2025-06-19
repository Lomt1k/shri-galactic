import styles from './Header.module.css';
import type { FC } from 'react';
import { Container } from '@/shared/components';
import { IconLogo } from '@/shared/icons';
import { Link } from 'react-router';
import MainNav from './MainNav';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.header__wrapper}>
          <div className={styles.header__left}>
            <Link className={styles.header__logo} to="/" aria-label="На главную">
              <IconLogo />
            </Link>
            <span className={styles.header__heading}>Межгалактическая аналитика</span>
          </div>
          <MainNav />
        </div>
      </Container>
    </header>
  );
};

export default Header;
