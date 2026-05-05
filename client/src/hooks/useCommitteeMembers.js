// client/src/hooks/useCommitteeMembers.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useCommitteeMembers() {
  return useQuery({
    queryKey: ['committee-members'],
    queryFn: api.committee.getMembers
  });
}
