import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useRef } from "react";
import { TMaterialInput } from "@/lib/types";
import { MaterailEnum, SearchParamsEnum } from "@/lib/resource";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";

const fetchMaterial = async ({
  page,
  per_page,
}: {
  page: number;
  per_page: number;
}) => {
  try {
    const url = new URLSearchParams({});
    if (page) url.set(SearchParamsEnum.PAGE, page?.toString());
    if (per_page) url.set(SearchParamsEnum.PER_PAGE, per_page?.toString());

    const response = await fetch(
      `/api/materials?${url?.toString()}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }

    const data = await response.json();
    return {
      page: data?.page,
      items: data?.data,
      totalPages: data?.totalPages,
    };
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

interface IProps {
  reset:  UseFormReset<{
    materialName: string;
    price: string | number;
    sellPrice: string | number;
    stock: string | number;
    stockUnits: "meters" | "units";
    category: "plumber" | "electrical" | "carpentors" | "c.p.v.c_pipe_and_fittings" | "u.p.v.c_pipe_and_fittings" | "g.i_fittings" | "sanitary_and_fittings";
    quantity: string;
    id?: string | undefined;
}>;
  getValues: UseFormReset<{
    materialName: string;
    price: string | number;
    sellPrice: string | number;
    stock: string | number;
    stockUnits: "meters" | "units";
    category: "plumber" | "electrical" | "carpentors" | "c.p.v.c_pipe_and_fittings" | "u.p.v.c_pipe_and_fittings" | "g.i_fittings" | "sanitary_and_fittings";
    quantity: string;
    id?: string | undefined;
}>;
}

const MaterialList = ({ reset, getValues }: IProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["materials"],
      queryFn: async ({ pageParam = 1 }) =>
        fetchMaterial({ page: pageParam, per_page: 20 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: unknown) => {
        const tLastPage = lastPage as { page: number; totalPages: number };
        if (tLastPage?.page < tLastPage.totalPages) {
          return tLastPage.page + 1;
        }
        return undefined;
      },
    });

    useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  const materialsList =
    data?.pages.flatMap((each: { items: TMaterialInput[] }) => each.items) ??
    [];

  return (
    <Command>
      <CommandInput placeholder="Search materials..." className="h-9" />
      <CommandList className="h-44">
        <CommandEmpty>No Materails Found</CommandEmpty>
        <CommandGroup>
          {materialsList.map((material: TMaterialInput, index: number) => (
            <CommandItem
              key={material.id}
              value={material.materialName}
              onSelect={() => {
                reset({
                  ...(material as TMaterialInput),
                  quantity: "1",
                });
              }}
              ref={materialsList.length === index + 1 ? sentinelRef : null}
            >
              {material.materialName} - {material.price} {material.stockUnits}
              <Check
                className={cn(
                  "ml-auto",
                  material.materialName ===
                    getValues()?.[MaterailEnum.MATERIAL_NAME]
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
          {/* <CommandItem>Loading</CommandItem> */}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default MaterialList;
