import React from 'react';

// FIXED IMPORTS — no more @/ aliases
import VendorIntelligenceDashboard from '../components/VendorIntelligenceDashboard';
import useTransactions from '../hooks/useTransactions';

export default function VendorIntelligence() {
  const { transactions } = useTransactions();

  return (
    <div>
      <VendorIntelligenceDashboard transactions={transactions} />
    </div>
  );
}
