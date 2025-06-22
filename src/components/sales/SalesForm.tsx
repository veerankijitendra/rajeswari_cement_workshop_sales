"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormItem,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {  TMaterialInput } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MaterailEnum, salesSchema, materialSchema } from "@/lib/resource";
import { z } from "zod";

const refinedSalesSchema = salesSchema.pick({
  [MaterailEnum.QUANTITY]: true,
});



const refinedMaterialSchema = materialSchema.merge(refinedSalesSchema)

type TSales = z.infer<typeof refinedMaterialSchema>;


const materialsList = [
  {
    materialName: "LED Strip",
    price: "450",
    sellPrice: "500",
    stock: "55",
    stockUnits: "meters",
    category: "electrical",
    id: "685555242f4b8ce4e10a0399",
  },
  {
    materialName: "Chisel Set",
    price: "290",
    sellPrice: "350",
    stock: "15",
    stockUnits: "units",
    category: "carpentors",
    id: "685555242f4b8ce4e10a0394",
  },
  {
    materialName: "Shower Head",
    price: "220",
    sellPrice: "270",
    stock: "36",
    stockUnits: "units",
    category: "plumber",
    id: "685555242f4b8ce4e10a0398",
  },
  {
    materialName: "Laminated Board",
    price: "670",
    sellPrice: "750",
    stock: "28",
    stockUnits: "units",
    category: "carpentors",
    id: "685555242f4b8ce4e10a0397",
  },
  {
    materialName: "Extension Cord",
    price: "230",
    sellPrice: "280",
    stock: "47",
    stockUnits: "units",
    category: "electrical",
    id: "685555242f4b8ce4e10a0396",
  },
  {
    materialName: "Ball Valve",
    price: "110",
    sellPrice: "140",
    stock: "65",
    stockUnits: "units",
    category: "plumber",
    id: "685555242f4b8ce4e10a0395",
  },
  {
    materialName: "PVC Reducer",
    price: "60",
    sellPrice: "80",
    stock: "90",
    stockUnits: "units",
    category: "plumber",
    id: "685555242f4b8ce4e10a0392",
  },
  {
    materialName: "Electric Tester",
    price: "100",
    sellPrice: "130",
    stock: "75",
    stockUnits: "units",
    category: "electrical",
    id: "685555242f4b8ce4e10a0393",
  },
  {
    materialName: "Hammer",
    price: "320",
    sellPrice: "400",
    stock: "20",
    stockUnits: "units",
    category: "carpentors",
    id: "685555242f4b8ce4e10a0391",
  },
  {
    materialName: "Bulb Holder",
    price: "45",
    sellPrice: "60",
    stock: "220",
    stockUnits: "units",
    category: "electrical",
    id: "685555242f4b8ce4e10a038d",
  },
];


const SalesForm: React.FC = () => {
  const { register, handleSubmit, reset, getValues, formState: {errors} } = useForm<TSales>({
    resolver: zodResolver(refinedMaterialSchema),
  });


  const getStock = (value: string) => {
   

  }

  const error = () => Object.values(errors).length > 0 ? Object.values(errors)[0]?.message : ""

  return (
    <div className="h-full sm:h-auto overflow-auto p-4">
      <form
        className="grid grid-cols-1 gap-4 relative"
        onSubmit={handleSubmit((data) => {})}
      >
        {/* <X size={16} className="absolute right-1 top-1 text-sm" /> */}
        <h1 className="text-2xl font-semibold underline underline-offset-2">
          Sales Form
        </h1>
        {error() && (
          <div className="bg-red-100 border-[.5px] border-red-300 px-2 py-2 rounded-md w-auto max-w-full">
            <p className="text-red-500 font-semibold text-xs">{error()}</p>
          </div>
        )}
        <FormItem className="grid grid-cols-1 gap-2 ">
          <Label>Material</Label>
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
              <Command>
                <CommandInput
                  placeholder="Search materials..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No Materails Found</CommandEmpty>
                  <CommandGroup>
                    {materialsList.map((material) => (
                      <CommandItem
                        key={material.id}
                        value={material.materialName}
                        onSelect={() => {
                          reset({
                            ...(material as TMaterialInput),
                            quantity: "1",
                          });
                        }}
                      >
                        {material.materialName} - {material.price}{" "}
                        {material.stockUnits}
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
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
        <div className="grid grid-cols-1 gap-2 ">
          <Label>Quantity</Label>
          <Input
            // type="number"
            {...register(MaterailEnum.QUANTITY)}
            placeholder="Enter quantity"
            min={1}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label>Price</Label>
          <Input
            {...register(MaterailEnum.PRICE)}
            className="text-muted-foreground"
            readOnly
            placeholder="Price"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label>Sell Price</Label>
          <Input
            {...register(MaterailEnum.SELL_PRICE)}
            placeholder="Sell Price"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 ">
          <Label>Stock</Label>
          <Input
            {...register(MaterailEnum.STOCK)}
            className="text-muted-foreground"
            readOnly
            placeholder="Stock"
          />
        </div>
        <Button className="" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SalesForm;
