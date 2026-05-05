import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateMeeting() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, updates }) => {
      const res = await axios.put(`/api/meetings/update/${id}`, updates);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('meetings');
      }
    }
  );
}
