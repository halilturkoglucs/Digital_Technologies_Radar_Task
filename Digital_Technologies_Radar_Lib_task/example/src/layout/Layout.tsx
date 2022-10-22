import React from 'react';

import style from './Layout.module.scss';

export const Layout: React.FC = ({ children }) => (
  <div className={style.layout}>{children}</div>
);
