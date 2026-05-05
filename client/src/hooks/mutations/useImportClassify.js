import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useImportClassify() {
  const queryClient = useQueryClient();

  return useMutation(
    async payload => {
      const res = await axios.post('/api/import/classify', payload);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('importPreview');
      }
    }
  );
}
