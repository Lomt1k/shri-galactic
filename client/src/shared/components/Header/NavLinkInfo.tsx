import { IconGenerator, IconHistory, IconUpload } from '@/shared/icons';
import type { ReactElement } from 'react';

export type NavLinkInfo = {
  url: string;
  text: string;
  icon: ReactElement;
};

export const NAV_LINKS: NavLinkInfo[] = [
  {
    url: '/analyst',
    text: 'CSV Аналитик',
    icon: <IconUpload />,
  },
  {
    url: '/generator',
    text: 'CSV Генератор',
    icon: <IconGenerator />,
  },
  {
    url: '/history',
    text: 'История',
    icon: <IconHistory />,
  },
];
