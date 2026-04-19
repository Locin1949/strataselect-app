import { useQuery } from "@tanstack/react-query";

export default function useMeetings() {
  return useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      const res = await fetch("https://strataselect-app.onrender.com/api/meetings");
      if (!res.ok) throw new Error("Meetings endpoint not implemented yet");
      return res.json();
    },
    enabled: false // prevents errors until backend route exists
  });
}
