"use client";
import "@/app/table-custom.css";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TMaterialInput } from "@/lib/types";
import { useRouter } from "next/navigation";
import { MaterailEnum } from "@/lib/resource";
import { useMaterialStore, useSingleMaterialStore } from "@/lib/store/material";
import { Button } from "../ui/button";
import Modal from "../home/Modal";
import NewMaterialForm from "./InventoryForm";
import SalesForm from "../sales/SalesForm";
import Pagination from "../home/Pagination";

const columns: ColumnDef<TMaterialInput>[] = [
  { accessorKey: MaterailEnum.MATERIAL_NAME, header: "Material Name" },
  { accessorKey: MaterailEnum.PRICE, header: "Price" },
  { accessorKey: MaterailEnum.SELL_PRICE, header: "Sell Price" },
  { accessorKey: MaterailEnum.STOCK, header: "Stock" },
  { accessorKey: MaterailEnum.STOCK_UNITS, header: "Stock Units" },
  { accessorKey: MaterailEnum.CATEGORY, header: "Category" },
  {
    accessorKey: MaterailEnum.ID,
    header: "Actions",
    cell: () => (
      <div className="flex gap-4">
        <Button
          variant={"outline"}
          data-button-type="sell"
          className="bg-[#1e293b] text-white hover:bg-[#0f172a] hover:text-white px-4 py-2 rounded font-medium hover:underline"
        >
          Sell
        </Button>
        <Button
          variant={"outline"}
          data-button-type="edit"
          className="text-blue-500 font-medium hover:underline"
        >
          Edit
        </Button>
      </div>
    ),
  },
];

export default function InventoryTable() {
  const data = useMaterialStore((state) => state.inventory.data);
  const page = useMaterialStore((state) => state.inventory.page);
  const pageCount = useMaterialStore((state) => state.inventory.totalPages);
  const [open, setOpen] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<"sell" | "inventory">(
    "inventory"
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();

  const handleTableClick = (event: React.MouseEvent<HTMLTableElement>) => {
    const target = event.target as HTMLElement;

    const button = target.closest(
      "button[data-button-type]"
    ) as HTMLButtonElement | null;

    if (button) {
      const buttonType = button.dataset.buttonType;

      const cell = button.closest("[data-object-id]") as HTMLElement | null;
      const rowData = cell ? JSON.parse(cell.dataset?.objectId || "{}") : null;

      if (!!rowData) {
        useSingleMaterialStore.setState(() => ({
          inventory: rowData,
        }));
      }

      if (buttonType === "edit") {
        setActiveForm("inventory");
        setOpen(true);
      }
      if (buttonType === "sell") {
        setActiveForm("sell");
        setOpen(true);
      }
    }
  };

  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    params.set('page', newPage.toString())
    router.push(`/inventory?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    updateURL("",page);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      <Modal isOpen={open} onClose={handleClose}>
        {activeForm === "inventory" ? <NewMaterialForm /> : <SalesForm />}
      </Modal>
      <Table className="table-custom" onClick={handleTableClick}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-2 text-left font-semibold text-gray-700"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              // className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  // className="px-4 py-2 border-t border-gray-200"
                  data-object-id={JSON.stringify(cell.row.original)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="py-4 self-end">
        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
