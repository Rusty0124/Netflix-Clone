import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const useIsAdmin = () => {
    const { data } = useQuery({
        queryKey: ["me"],
        queryFn: async () => (await axios.get<{ isAdmin: boolean }>("/api/me")).data,
        staleTime: 5 * 60 * 1000,
    });
    return data?.isAdmin ?? false
}

export default useIsAdmin