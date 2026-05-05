import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation(
    async meeting => {
      const res = await axios.post('/api/meetings/create', meeting);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('meetings');
      }
    }
  );
}
