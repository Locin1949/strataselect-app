// client/src/hooks/useMaintenance.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useMaintenance() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: api.maintenance.getAll
  });
}
