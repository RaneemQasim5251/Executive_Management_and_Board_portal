import React from 'react';
import { SimplifiedLayout } from '../components/layout/SimplifiedLayout';
import { SimplifiedDashboard } from './dashboard/SimplifiedDashboard';
import '../styles/simplified-design.css';

export const SimplifiedPortal: React.FC = () => {
  return (
    <SimplifiedLayout>
      <SimplifiedDashboard />
    </SimplifiedLayout>
  );
};

export default SimplifiedPortal;
