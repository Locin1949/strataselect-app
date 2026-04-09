import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMonthlyFinancials,
  getFinancialTransactions,
  addFinancialTransaction,
  updateFinancialTransaction,
  deleteFinancialTransaction
} from "../api";

export function useFinancials() {
  const queryClient = useQueryClient();

  const monthly = useQuery({
    queryKey: ["monthly"],
    queryFn: getMonthlyFinancials
  });

  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: getFinancialTransactions
  });

  const addTxn = useMutation({
    mutationFn: addFinancialTransaction,
    onSuccess: () => queryClient.invalidateQueries(["transactions"])
  });

  const updateTxn = useMutation({
    mutationFn: ({ id, data }) => updateFinancialTransaction(id, data),
    onSuccess: () => queryClient.invalidateQueries(["transactions"])
  });

  const deleteTxn = useMutation({
    mutationFn: deleteFinancialTransaction,
    onSuccess: () => queryClient.invalidateQueries(["transactions"])
  });

  return {
    monthly,
    transactions,
    addTxn,
    updateTxn,
    deleteTxn
  };
}
