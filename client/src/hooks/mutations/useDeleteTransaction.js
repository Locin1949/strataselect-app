import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation(
    async transactionId => {
      const res = await axios.delete(`/api/transactions/delete/${transactionId}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
      }
    }
  );
}
