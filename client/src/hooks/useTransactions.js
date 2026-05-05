import { useFinancials } from './useFinancials';

export default function useTransactions() {
  const { transactions } = useFinancials();
  return { transactions };
}
