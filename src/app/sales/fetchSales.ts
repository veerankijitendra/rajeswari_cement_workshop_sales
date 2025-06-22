import { TSearchParams } from "@/lib/types";

export const fetchSales = async (
 {page,per_page,search}:TSearchParams
): Promise<unknown> => {
  try {
    console.log(page,per_page,search,"jitendra")
    const url = new URLSearchParams({});
    page && url.set("page",page?.toString())
    per_page && url.set("perPage",per_page?.toString())
    search && url.set("search", search?.toString())
    console.log(url?.toString())

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sales?${url?.toString()}`,
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

  return "";
};
