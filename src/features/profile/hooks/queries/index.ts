import { useQuery } from "@tanstack/react-query";
import { fetchRiderProfile } from "../../services";
import { RiderProfile } from "../../types";

export const useFetchRiderProfile = () => {
    return useQuery<RiderProfile, Error>({
        queryKey: ["profile"],
        queryFn: fetchRiderProfile,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    })
}