import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateRfp() {
  const queryClient = useQueryClient();

  return useMutation(
    async rfp => {
      const res = await axios.post('/api/rfps/create', rfp);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rfps');
      }
    }
  );
}
