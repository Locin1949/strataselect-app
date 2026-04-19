import { useQuery } from "@tanstack/react-query";

export default function useCommitteeMembers() {
  return useQuery({
    queryKey: ["committee-members"],
    queryFn: async () => {
    const res = await fetch("https://strataselect-app.onrender.com/api/users");
      if (!res.ok) throw new Error("Failed to fetch committee members");
      return res.json();
    }
  });
}
