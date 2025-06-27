"use client";
import "@/app/table-custom.css";
import React, { useEffect, useRef, useState,} from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { MaterailEnum, SearchParamsEnum } from "@/lib/resource";
import { useMaterialStore, useModelStore } from "@/lib/store/material";
import { Button } from "../ui/button";
import Modal from "../home/Modal";
import NewMaterialForm from "./InventoryForm";
import SalesForm from "../sales/SalesForm";
import Pagination from "../home/Pagination";
import { Search, ChevronDown } from "lucide-react";
import { Menubar } from "@radix-ui/react-menubar";
import {
  MenubarTrigger,
  MenubarGroup,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarCheckboxItem,
  
} from "../ui/menubar";
import { Input } from "../ui/input";
import { categoriesDisplayList } from "@/lib/utils";

const columns: ColumnDef<TMaterialInput>[] = [
  { accessorKey: MaterailEnum.MATERIAL_NAME, header: "Material Name" },
  { accessorKey: MaterailEnum.SELL_PRICE, header: "Sell Price" },
  { accessorKey: MaterailEnum.PRICE, header: "Price" },
  { accessorKey: MaterailEnum.STOCK, header: "Stock" },
  { accessorKey: MaterailEnum.TOTAL_PRICE, header: "Total Price" },
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
          className="btn-secondary"
        >
          Sell
        </Button>
        <Button
          variant={"outline"}
          data-button-type="edit"
          className="btn-primary"
        >
          Edit
        </Button>
      </div>
    ),
  },
];


export default function InventoryTable() {
  const content = useModelStore((state) => state.content);
  const open = useModelStore((state) => state.open);
  const closeModel = useModelStore((state) => state.closeModel);
  const updateContent = useModelStore((state) => state.openModel);
  const data = useMaterialStore((state) => state.inventory.data);
  const page = useMaterialStore((state) => state.inventory.page);
  const pageCount = useMaterialStore((state) => state.inventory.totalPages);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const previousSearchParams = useRef<string>("")

  const [search,setSearch] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [isSearchOpened, setIsSearchOpened] = useState<boolean>(false);

  useEffect(() => {
    const search = searchParams.get(SearchParamsEnum.SEARCH);
    const category = searchParams.getAll(SearchParamsEnum.CATEGORY);
    if(search){
      setSearch(search)
    }

    if(category) {
      if(Array.isArray(category)) setSelectedCategory(category);
      if(typeof category === 'string') setSelectedCategory([category])
    }
  },[page, pageCount, searchParams])

  const inputRef = React.useRef<HTMLInputElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });



  useEffect(() => {
    if (isSearchOpened) {
      const timeout = setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isSearchOpened]);

  const handleTableClick = (event: React.MouseEvent<HTMLTableElement>) => {
    const target = event.target as HTMLElement;

    const button = target.closest(
      "button[data-button-type]"
    ) as HTMLButtonElement | null;

    if (button) {
      const buttonType = button.dataset.buttonType;

      const cell = button.closest("[data-object-id]") as HTMLElement | null;
      const rowData = cell ? JSON.parse(cell.dataset?.objectId || "{}") : null;

      if (buttonType === "edit") {
        updateContent(<NewMaterialForm material={rowData ? rowData : null} />);
      }
      if (buttonType === "sell") {
        updateContent(<SalesForm material={rowData ? rowData : null} />);
      }
    }
  };

  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (newSearch) params.set("search", newSearch);
    params.set("page", newPage.toString());
    router.replace(`/inventory?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateURL(search, page);
  };

  const handleCheckBox = (value:string) => () => {
    setSelectedCategory(categoryList => categoryList.includes(value) ? categoryList.filter(each =>  each!== value): [...categoryList,value])

  }

  const handleClosAutoFocus = () => {
    const newParams = new URLSearchParams(searchParams?.toString())
    newParams.delete(SearchParamsEnum.CATEGORY);
    if(selectedCategory.length > 0) {
      selectedCategory.forEach( each =>   
        {newParams.append(SearchParamsEnum.CATEGORY, each)})
    }

  

    if(previousSearchParams.current !== newParams?.toString()) {
      newParams.set(SearchParamsEnum.PAGE, "1")
      previousSearchParams.current = newParams?.toString();
      router.replace(`/inventory?${newParams.toString()}`);

    }
  }

  const handleSearchAutoFocus = () => {
    const newParams = new URLSearchParams(searchParams?.toString());

    if (search.trim().length > 0) {
      newParams.set(SearchParamsEnum.SEARCH, search.trim());
    }

    if(search.trim().length === 0) newParams.delete(SearchParamsEnum.SEARCH);

    if (previousSearchParams.current !== newParams?.toString()) {
      newParams.set(SearchParamsEnum.PAGE, "1")
      previousSearchParams.current = newParams?.toString();
      router.replace(`/inventory?${newParams.toString()}`);
    }
  };

  const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);
  

  const renderCategoryMenu = (name: string) => {
    return (
      <Menubar className="w-fit">
        <MenubarMenu>
          <MenubarTrigger
            onPointerDown={() => setIsSearchOpened(true)}
            className="flex items-center justify-center gap-1"
          >
            {name}{" "}
            {name === "Category" ? (
              <ChevronDown className="mt-0.5" size={19} />
            ) : (
              <Search className="mt-0.5" size={15} />
            )}
          </MenubarTrigger>
          {name === "Category" ? (
            <MenubarContent className="min-w-fit" onCloseAutoFocus={handleClosAutoFocus}>
              <MenubarGroup>
                {categoriesDisplayList.map(cat => <MenubarCheckboxItem  onSelect={(e) => e.preventDefault()} checked={selectedCategory.includes(cat.value)} onCheckedChange={handleCheckBox(cat.value)} key={cat.value}>
                  {cat.name}
                  </MenubarCheckboxItem>)}
              </MenubarGroup>
            </MenubarContent>
          ) : (
            <MenubarContent
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                setIsSearchOpened(false);
                handleSearchAutoFocus()
              }}
              className="min-w-fit p-0"
            >
              <MenubarItem>
                <Search className="text-cyprus" />
                <Input
                  className="h-full outline-none border-0 shadow-none font-normal text-sm text-cyprus"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={handleSearchValueChange}
                  value={search}
                  ref={inputRef}
                />
              </MenubarItem>
            </MenubarContent>
          )}
        </MenubarMenu>
      </Menubar>
    );
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      <Modal isOpen={open} onClose={closeModel}>
        {content}
      </Modal>
      <Table className="table-custom" onClick={handleTableClick}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const name = flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                );
                return (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-left font-semibold text-gray-700"
                  >
                    {["Category", "Material Name"].includes(name as string)
                      ? renderCategoryMenu(name as string)
                      : name}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  const isPrice = [
                    MaterailEnum.PRICE,
                    MaterailEnum.SELL_PRICE,
                    MaterailEnum.TOTAL_PRICE,
                   // @ts-expect-error - this value might be undefined in edge cases
                  ].includes(cell.column.columnDef.accessorKey);

                  return (
                    <TableCell
                      key={cell.id}
                      data-object-id={JSON.stringify(cell.row.original)}
                    >
                      {`${isPrice ? "₹" : ""}`}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
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
