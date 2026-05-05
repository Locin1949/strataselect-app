// client/src/hooks/useMaintenanceAudit.js
import { useQuery } from '@tanstack/react-query';

import api from '../api/namespaced';

export default function useMaintenanceAudit(maintenanceId) {
  return useQuery({
    queryKey: ['maintenance-audit', maintenanceId],
    queryFn: () => api.maintenance.getAudit(maintenanceId),
    enabled: !!maintenanceId
  });
}
