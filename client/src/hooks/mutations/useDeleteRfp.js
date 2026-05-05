import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteRfp() {
  const queryClient = useQueryClient();

  return useMutation(
    async rfpId => {
      const res = await axios.delete(`/api/rfps/delete/${rfpId}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rfps');
      }
    }
  );
}
