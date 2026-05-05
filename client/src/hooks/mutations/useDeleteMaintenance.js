import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation(
    async maintenanceId => {
      const res = await axios.delete(`/api/maintenance/delete/${maintenanceId}`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('maintenance');
      }
    }
  );
}
