import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteCommitteeMember() {
  const queryClient = useQueryClient();

  return useMutation(
    async memberId => {
      const res = await axios.delete(`/api/committee/delete/${memberId}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('committeeMembers');
      }
    }
  );
}
