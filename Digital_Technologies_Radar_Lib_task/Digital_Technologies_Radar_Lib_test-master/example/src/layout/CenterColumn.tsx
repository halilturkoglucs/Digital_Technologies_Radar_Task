import React from 'react';

import style from './Layout.module.scss';

export const CenterColumn: React.FC = ({ children }) => (
  <div className={`${style.column} ${style.center}`}>{children}</div>
);
