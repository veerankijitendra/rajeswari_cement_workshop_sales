"use client";

import InventoryTable from "@/components/inventory/InventoryTable";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMaterialStore, useModelStore } from "@/lib/store/material";
import NewMaterialForm from "./InventoryForm";
import Modal from "../home/Modal";
import { TMaterialResponse, TSearchParams } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "@/app/inventory/fetchInventory";
import { ArrowLeftIcon, Plus, FunnelX } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "../Loader";
import useResize from "@/hooks/useResize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useFilterClear from "@/hooks/useFilterClear";
import { staleTime } from "@/lib/utils";
interface IProps extends TSearchParams {
  data?: unknown;
}

function updateMaterialStore(data: unknown) {
  if (!!data) {
    useMaterialStore.setState(() => ({
      inventory: data as TMaterialResponse,
    }));
  }
}

const InventoryPage: React.FC<IProps> = ({
  search,
  page,
  per_page,
  category,
}) => {
  const content = useModelStore((state) => state.content);
  const openModel = useModelStore((state) => state.openModel);
  const closeModel = useModelStore((state) => state.closeModel);
  const open = useModelStore((state) => state.open);
  const isMobileScreen = useResize();
  const { isFilterApplied, resetFilters } = useFilterClear();
  const router = useRouter();

  const { data, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: ["inventory", search, page, per_page, category],
    queryFn: () => fetchInventory({ search, page, per_page, category }),
    staleTime,
  });

  useEffect(() => {
    updateMaterialStore(data);
  }, [data]);

  const handleNewItem = () => {
    openModel(<NewMaterialForm />);
  };

  const handleBack = () => router.push("/");

  return (
    <>
      <Modal isOpen={open} onClose={closeModel}>
        {content}
      </Modal>
      <div className="p-2 w-full overflow-x-clip flex flex-col">
        <div className="flex gap-4 items-center py-4 justify-between flex-wrap">
          <div className="flex items-center gap-4 justify-between">
            <Tooltip>
              <TooltipTrigger>
                <Button variant={"outline"} onClick={handleBack}>
                  <ArrowLeftIcon size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to home.</TooltipContent>
            </Tooltip>

            <h1 className="text-xl sm:text-3xl font-bold">Material</h1>
          </div>
          <div className="flex gap-2">
            {isFilterApplied && (
              <Tooltip>
                <TooltipTrigger>
                  <Button className="btn-primary" onClick={resetFilters}>
                    {isMobileScreen ? (
                      <FunnelX className="text-cyprus" />
                    ) : (
                      "Clear"
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Filter</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger>
                <Button className="btn-secondary" onClick={handleNewItem}>
                  {isMobileScreen ? <Plus size={16} /> : "Add New Item"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add New Item</TooltipContent>
            </Tooltip>
          </div>
        </div>
        {!(isLoading || isFetching || isRefetching) && <InventoryTable />}
        <div className="grow">{(isFetching || isLoading) && <Loading />}</div>
      </div>
    </>
  );
};

export default InventoryPage;
