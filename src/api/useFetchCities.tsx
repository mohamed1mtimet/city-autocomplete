import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface City {
  id: string;
  name: string;
}

interface UseFetchCitiesParams {
  query: string;
}

const useFetchCities = ({ query }: UseFetchCitiesParams) => {
  return useQuery<City[], Error>({
    queryKey: ["cities", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await axios.get(
        `https://etherqmshqkpehcowxqh.supabase.co/functions/v1/cities?search=${query}`
      );
      return response.data;
    },
    enabled: query.length >= 2,
    staleTime: Infinity,
  });
};

export default useFetchCities;
