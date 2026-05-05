// client/src/hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: api.dashboard.getHealth
  });
}
