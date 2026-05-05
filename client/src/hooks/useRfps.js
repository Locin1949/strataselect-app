// client/src/hooks/useRfps.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useRfps() {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: api.rfps.getAll
  });
}
