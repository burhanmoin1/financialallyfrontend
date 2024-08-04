export interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}
  
export interface ApiResponse {
    status: number;
    data: {
      error?: string;
    };
  }

import { ReactNode } from 'react';

export interface StoreProviderProps {
    children: ReactNode;
}
  