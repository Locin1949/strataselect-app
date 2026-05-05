// client/src/hooks/useMaintenanceExtras.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useMaintenanceExtras() {
  return useQuery({
    queryKey: ['maintenance-extras'],
    queryFn: api.maintenance.getExtras
  });
}
