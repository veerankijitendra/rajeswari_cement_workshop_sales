import SalesTable from "@/components/sales/SalesTable";
import { TSearchParams } from "@/lib/types";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { searchParamsSchema } from "@/lib/resource";
import { redirect } from "next/navigation";
import { fetchSales } from "./fetchSales";

const SalesPage = async (params: { searchParams: Promise<TSearchParams> }) => {
  const queryClient = new QueryClient();
  const searchParams = await params.searchParams;
  let dehydratedData = null;
  const parsedData = searchParamsSchema.safeParse(searchParams);

  if (!parsedData.success) redirect("/sales");

  try {
    const { page, per_page, search } = parsedData.data;
    await queryClient.prefetchQuery({
      queryKey: ["sales",page,per_page,search],
      queryFn: () => fetchSales(parsedData.data),
    });
    dehydratedData = dehydrate(queryClient);
  } catch (error) {
    console.error("Failed to fetch the data", error);
  }

  return (
    <HydrationBoundary state={dehydratedData}>
      <SalesTable {...parsedData.data} />
    </HydrationBoundary>
  );
};

export default SalesPage;
