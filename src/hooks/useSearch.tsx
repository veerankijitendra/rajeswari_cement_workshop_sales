import { fetchSales } from "@/app/sales/fetchSales";
import { useQuery } from "@tanstack/react-query";

function useSearch(search: string, page:number=1, per_page: number=10) {
    return useQuery({
        queryKey: [search,],
        queryFn: () => {
            fetchSales({search,page,per_page})
        },
        staleTime: 1 * 60 * 60 * 1000,
        enabled: !!search,
    })
}