'use client';
import { Provider } from 'react-redux';
import store  from './store';
import { StoreProviderProps } from '../types/common';

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
