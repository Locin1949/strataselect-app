import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateRfp() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, updates }) => {
      const res = await axios.put(`/api/rfps/update/${id}`, updates);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rfps');
      }
    }
  );
}
