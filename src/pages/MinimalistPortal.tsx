import React from 'react';
import { MinimalistLayout } from '../components/layout/MinimalistLayout';
import { MinimalistDashboard } from './dashboard/MinimalistDashboard';
import '../styles/minimalist.css';

export const MinimalistPortal: React.FC = () => {
  return (
    <MinimalistLayout>
      <MinimalistDashboard />
    </MinimalistLayout>
  );
};

export default MinimalistPortal;
