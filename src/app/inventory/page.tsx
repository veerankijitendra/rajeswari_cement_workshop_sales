import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import InventoryPage from "@/components/inventory/InventoryPage";
import { fetchInventory } from "./fetchInventory";
import { searchParamsSchema } from "@/lib/resource";
import { TSearchParams } from "@/lib/types";

import { redirect } from "next/navigation";
import { staleTime } from "@/lib/utils";

const Inventory: React.FC = async (props: {
  searchParams?: Promise<TSearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  let dehydratedState = null;

  const parsedData = searchParamsSchema.safeParse(searchParams);

  if (!parsedData.success)  redirect("/inventory");
  const { page, per_page, search, category } = parsedData.data;

  try {
    await queryClient.prefetchQuery({
      queryKey: ["inventory", search, page, per_page, category],
      queryFn: () => fetchInventory(parsedData.data),
      staleTime
    });

    dehydratedState = dehydrate(queryClient);
  } catch (error) {
    console.error("Failed to prefetch the inventory ", error);
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <InventoryPage search={search} page={page} per_page={per_page} category={category} />
    </HydrationBoundary>
  );
};

export default Inventory;
