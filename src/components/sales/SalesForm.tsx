"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MaterailEnum, salesSchema, materialSchema } from "@/lib/resource";
import { z } from "zod";

import MaterialList from "./MaterialList";
import { TSalesInput } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModelStore } from "@/lib/store/material";
import { toast } from "sonner";
import { createUpdateSales } from "./fetchSales";

const refinedSalesSchema = salesSchema.pick({
  [MaterailEnum.QUANTITY]: true,
});

const refinedMaterialSchema = materialSchema.merge(refinedSalesSchema);

type TSales = z.infer<typeof refinedMaterialSchema>;

const SalesForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    setError,
  } = useForm<TSales>({
    resolver: zodResolver(refinedMaterialSchema),
  });

  const queryClient = useQueryClient()
  const closeModel = useModelStore((state) => state.closeModel);

  const error = () =>
    Object.values(errors).length > 0 ? Object.values(errors)[0]?.message : "";

  const {mutate, isPending} = useMutation({
    mutationKey: ["sales"],
    mutationFn: createUpdateSales,
    onSuccess: () => {
      closeModel();
      queryClient.invalidateQueries({queryKey: ["inventory"],})
      reset();
      toast.success("Sales updated successfully!",{position:"top-center"})
    },
    onError: (error) => {
      toast.error("Sales creation failed"+JSON.stringify(error), { position: "top-center" });
    },
  });

  const onSubmit = (data: TSales) => {
    const { stock, quantity, id, price, sellPrice } = data;

    if (+quantity > +stock) {
      return setError("quantity", {
        message: `Qauntity is too high! \n please select the qauntity below the ${stock}.`,
      });
    }

    if (!id) return setError("root", { message: "Please select the material" });
    const inputData: TSalesInput = {
      materialId: id,
      price,
      quantity,
      sellPrice,
    };

    mutate({data: inputData,isEdit: false})
    
  };

  return (
    <div className="h-full sm:h-auto overflow-auto p-4">
      <form
        className="grid grid-cols-1 gap-4 relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold underline underline-offset-2 text-cyprus">
          Sales Form
        </h1>
        {error() && (
          <div className="bg-red-100 border-[.5px] border-red-300 px-2 py-2 rounded-md w-auto max-w-full">
            <p className="text-red-500 font-semibold text-xs">{error()}</p>
          </div>
        )}
        <FormItem className="grid grid-cols-1 gap-2 ">
          <Label className="text-cyprus">Material</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full flex justify-between",
                  !getValues()?.[MaterailEnum.MATERIAL_NAME] &&
                    "text-muted-foreground"
                )}
              >
                {!!getValues()?.[MaterailEnum.MATERIAL_NAME]
                  ? getValues()?.[MaterailEnum.MATERIAL_NAME]
                  : "Select Material"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <MaterialList reset={reset} getValues={getValues} />
            </PopoverContent>
          </Popover>
        </FormItem>
        <div className="grid grid-cols-1 gap-2 ">
          <Label className="text-cyprus">Quantity</Label>
          <Input
            // type="number"
            {...register(MaterailEnum.QUANTITY)}
            placeholder="Enter quantity"
            min={1}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label className="text-cyprus">Price</Label>
          <Input
            {...register(MaterailEnum.PRICE)}
            className="text-muted-foreground"
            readOnly
            placeholder="Price"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label className="text-cyprus">Sell Price</Label>
          <Input
            {...register(MaterailEnum.SELL_PRICE)}
            placeholder="Sell Price"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label className="text-cyprus">Stock</Label>
          <Input
            {...register(MaterailEnum.STOCK)}
            className="text-muted-foreground"
            readOnly
            placeholder="Stock"
          />
        </div>
        <Button disabled={isPending} className="btn-secondary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SalesForm;
