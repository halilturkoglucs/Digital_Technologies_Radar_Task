import React from 'react';

import style from './Layout.module.scss';

export const RightColumn: React.FC = ({ children }) => (
  <div className={`${style.column} ${style.right}`}>{children}</div>
);
