import { TSearchParams } from "@/lib/types";

export const fetchSales = async (
 {page,per_page,search}:TSearchParams
): Promise<unknown> => {
  try {
    const url = new URLSearchParams({});
     if(page) url.set("page",page?.toString());
    if(per_page) url.set("perPage",per_page?.toString());
    if(search)  url.set("search", search?.toString());

    const response = await fetch(
      `/api/sales?${url?.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
