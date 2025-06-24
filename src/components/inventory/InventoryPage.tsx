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
import { ArrowLeftIcon, } from "lucide-react";
import { useRouter } from "next/navigation";
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

const InventoryPage: React.FC<IProps> = ({ search, page, per_page, category }) => {
  const content = useModelStore((state) => state.content);
  const openModel = useModelStore((state) => state.openModel);
  const closeModel = useModelStore((state) => state.closeModel);
  const open = useModelStore(state => state.open)
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["inventory", search, page, per_page],
    queryFn: () => fetchInventory({ search, page, per_page, category }),
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
            <Button variant={"outline"} onClick={handleBack}>
              <ArrowLeftIcon size={24} />
            </Button>
            <h1 className="text-xl sm:text-3xl font-bold">Inventory</h1>
          </div>
          <Button className="btn-secondary" onClick={handleNewItem}>
            Add New Item
          </Button>
        </div>
        <InventoryTable />
      </div>
    </>
  );
};

export default InventoryPage;
