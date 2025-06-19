import type { FC } from 'react';
import styles from './MainNav.module.css';
import { NAV_LINKS } from './NavLinkInfo';
import { NavLink } from 'react-router';

const MainNav: FC = () => {
  return (
    <nav>
      <ul className={styles['main-nav__list']}>
        {NAV_LINKS.map(({ url, text, icon }) => (
          <li key={url}>
            <NavLink
              to={url}
              className={({ isActive }) =>
                styles['main-nav__link'] + (isActive ? ' ' + styles['main-nav__link--active'] : '')
              }
            >
              <div className={styles['main-nav__link-content']}>
                {icon}
                <span>{text}</span>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
