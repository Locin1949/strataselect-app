import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation(
    async transaction => {
      const res = await axios.post('/api/transactions/add', transaction);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
      }
    }
  );
}
