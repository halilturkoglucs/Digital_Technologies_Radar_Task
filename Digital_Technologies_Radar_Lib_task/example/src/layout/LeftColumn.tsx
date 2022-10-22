import React from 'react';

import style from './Layout.module.scss';

export const LeftColumn: React.FC = ({ children }) => (
  <div className={`${style.column} ${style.left}`}>{children}</div>
);
