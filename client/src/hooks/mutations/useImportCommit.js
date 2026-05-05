import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useImportCommit() {
  const queryClient = useQueryClient();

  return useMutation(
    async payload => {
      const res = await axios.post('/api/import/commit', payload);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('importPreview');
        queryClient.invalidateQueries('transactions');
      }
    }
  );
}
