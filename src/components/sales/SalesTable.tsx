"use client";
import React, { useState, useEffect, useTransition } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";
import Pagination from "../home/Pagination";
import { TSalesResponse, TSearchParams } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/app/sales/fetchSales";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import Loading from "../Loader";
import { SearchParamsEnum, staleTime } from "@/lib/resource";
import useDebounce from "@/hooks/useDebounce";
interface IProps extends TSearchParams {
  data?: unknown;
}


const SalesTable = ({ page, per_page, search: query, category }: IProps) => {
  const [search, setSearch] = useState(query ? query : "");
  const [,startTransition] = useTransition()

  const router = useRouter();


  const {
    data: response,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["sales", page, per_page, query],
    queryFn: () => fetchSales({ page, per_page, search: query, category }),
    staleTime,
    
  });

  const debounce = useDebounce(search)

  const getStoreData = () => {
    const { data, page, totalPages } = response as TSalesResponse;

    return {
      data,
      page,
      totalPages,
    };
  };

  useEffect(() => {
    startTransition(() => {
      updateURL(debounce,1)
    })
  },[debounce])

  const updateURL = (newSearch: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch)
    else params.delete(SearchParamsEnum.SEARCH);
    params.set("page", newPage.toString());
    router.push(`/sales?${params.toString()}`);
  };

  const handleBack = () => router.push("/");

  const handlePageChange = (page: number) => updateURL("", page);

  return (
    <>
      <div className="w-full h-svh flex flex-col px-4 sm:px-8 py-8">
        <div className="mb-4 flex justify-between flex-wrap gap-2">
          <div className="flex items-center justify-between gap-2">
            <Button variant={"outline"} onClick={handleBack}>
              <ArrowLeftIcon size={16} />
            </Button>
            <h1 className="text-xl sm:text-3xl font-bold">Sales History</h1>
          </div>
          <Input
            type="text"
            placeholder="Search Material Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
        {isLoading || isFetching || isRefetching ? (
          <div className="w-full">
            <Loading />
          </div>
        ) : (
          <div className="grow flex flex-col gap-4 justify-between">
            <Table className="table-custom w-full border rounded-lg shadow-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sell Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getStoreData().data.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.materialName}</TableCell>
                    <TableCell>₹{sale.price}</TableCell>
                    <TableCell>₹{sale.sellPrice}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              className="flex-wrap"
              page={getStoreData().page}
              pageCount={getStoreData().totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SalesTable;
