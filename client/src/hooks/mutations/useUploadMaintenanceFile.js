import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useUploadMaintenanceFile() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ maintenanceId, file }) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`/api/maintenance/${maintenanceId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('maintenance');
        queryClient.invalidateQueries('maintenanceFiles');
      }
    }
  );
}
