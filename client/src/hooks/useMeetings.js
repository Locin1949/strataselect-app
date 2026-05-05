// client/src/hooks/useMeetings.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: api.meetings.getAll
  });
}
