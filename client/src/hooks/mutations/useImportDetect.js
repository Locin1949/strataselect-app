import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useImportDetect() {
  const queryClient = useQueryClient();

  return useMutation(
    async fileData => {
      const res = await axios.post('/api/import/detect', fileData);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('importPreview');
      }
    }
  );
}
