// client/src/hooks/useFinancials.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '../api/namespaced';

// -------------------------------
// CASHBOOK
// -------------------------------
export function useCashbook() {
  return useQuery({
    queryKey: ['cashbook'],
    queryFn: api.financials.getCashbook
  });
}

// -------------------------------
// IMPORT HISTORY
// -------------------------------
export function useImportHistory() {
  return useQuery({
    queryKey: ['import-history'],
    queryFn: api.financials.getImportHistory
  });
}

// -------------------------------
// FINANCIALS (transactions)
// -------------------------------
export function useFinancials() {
  const queryClient = useQueryClient();

  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: api.financials.getTransactions
  });

  const addTxn = useMutation({
    mutationFn: api.financials.addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    }
  });

  const updateTxn = useMutation({
    mutationFn: ({ id, data }) => api.financials.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    }
  });

  const deleteTxn = useMutation({
    mutationFn: id => api.financials.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    }
  });

  return { transactions, addTxn, updateTxn, deleteTxn };
}
