"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterailEnum, materialSchema } from "@/lib/resource";
import { TFormMaterialInput } from "@/lib/types";
import { toast } from "sonner"

const initialState: TFormMaterialInput = {
  [MaterailEnum.MATERIAL_NAME]: "",
  [MaterailEnum.PRICE]: "",
  [MaterailEnum.SELL_PRICE]: "",
  [MaterailEnum.STOCK]: "",
  [MaterailEnum.STOCK_UNITS]: "meters",
  [MaterailEnum.CATEGORY]: "plumber",
  
};

interface IProps {
    material?: TFormMaterialInput | null;
}

export default function NewMaterialForm({material}: IProps) {

  const [form, setForm] = useState<TFormMaterialInput>(!!material ? material : initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TFormMaterialInput, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const result = materialSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TFormMaterialInput, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof TFormMaterialInput;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding material:", errorData);
      toast.error("Failed to add material: " + errorData.message || "Unknown error");

      return;
    }
    const data = await response.json();

    setForm(initialState)
    toast.success("Material added successfully!",)

    console.log("Material added successfully:", data);

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full sm:h-auto overflow-auto max-w-md mx-auto mt-8 flex flex-col gap-4 bg-white p-6 rounded-lg shadow"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="materialName">Material Name</Label>
        <Input
          id="materialName"
          type="text"
          name="materialName"
          placeholder="Enter material name"
          value={form.materialName}
          onChange={handleChange}
          required
        />
        {errors.materialName && (
          <span className="text-red-500 text-sm">{errors.materialName}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="text"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
        />
        {errors.price && (
          <span className="text-red-500 text-sm">{errors.price}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="sellPrice">Sell Price</Label>
        <Input
          id="sellPrice"
          type="text"
          name="sellPrice"
          value={form.sellPrice}
          onChange={handleChange}
          placeholder="Enter sell price"
          required
        />
        {errors.sellPrice && (
          <span className="text-red-500 text-sm">{errors.sellPrice}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="text"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Enter stock quantity"
          required
        />
        {errors.stock && (
          <span className="text-red-500 text-sm">{errors.stock}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="stockUnits">Stock Units</Label>
        <select
          id="stockUnits"
          name="stockUnits"
          value={form.stockUnits}
          onChange={handleChange}
          
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="meters">Meters</option>
          <option value="units">Units</option>
        </select>
        {errors.stockUnits && (
          <span className="text-red-500 text-sm">{errors.stockUnits}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="plumber">Plumber</option>
          <option value="electrical">Electrical</option>
          <option value="carpentors">Carpentors</option>
        </select>
        {errors.category && (
          <span className="text-red-500 text-sm">{errors.category}</span>
        )}
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {!!material ? "Edit" : "Add"} Material
      </button>
    </form>
  );
}
