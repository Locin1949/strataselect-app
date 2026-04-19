import { useQuery } from "@tanstack/react-query";

export default function useMaintenanceAudit(maintenanceId) {
  return useQuery({
    queryKey: ["maintenance-audit", maintenanceId],
    queryFn: async () => {
      const res = await fetch(
        `https://strataselect-app.onrender.com/api/maintenance/${maintenanceId}/audit`
      );
      if (!res.ok) throw new Error("Maintenance audit endpoint not implemented yet");
      return res.json();
    },
    enabled: !!maintenanceId // only run when editing an existing item
  });
}
