import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation(
    async meetingId => {
      const res = await axios.delete(`/api/meetings/delete/${meetingId}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('meetings');
      }
    }
  );
}
