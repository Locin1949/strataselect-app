// client/src/hooks/useMaintenanceFiles.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useMaintenanceFiles() {
  return useQuery({
    queryKey: ['maintenance-files'],
    queryFn: api.maintenance.getFiles
  });
}
