import React from 'react';
import { MainLayout } from './MainLayout';

interface CustomLayoutProps {
  children: React.ReactNode;
}

export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};
