import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useAddCommitteeMember() {
  const queryClient = useQueryClient();

  return useMutation(
    async member => {
      const res = await axios.post('/api/committee/add', member);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('committeeMembers');
      }
    }
  );
}
