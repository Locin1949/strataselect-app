import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation(
    async maintenance => {
      const res = await axios.post('/api/maintenance/create', maintenance);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('maintenance');
      }
    }
  );
}
