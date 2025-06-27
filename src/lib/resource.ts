import { z } from "zod";

export enum MaterailEnum {
  MATERIAL_NAME = "materialName",
  PRICE = "price",
  SELL_PRICE = "sellPrice",
  STOCK = "stock",
  STOCK_UNITS = "stockUnits",
  CATEGORY = "category",
  ID = "id",
  MATERIAL_ID = "materialId",
  QUANTITY = "quantity",
  TOTAL_PRICE = "totalPrice",
}

const pricesSchema = z.object({
  [MaterailEnum.PRICE]: z
    .union([
      z.string({
        required_error: "Selling price required.",
        invalid_type_error: "Selling price must be a number",
      }),
      z.number(),
    ])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a Positive number",
    }),
  [MaterailEnum.SELL_PRICE]: z
    .union([
      z.string({
        required_error: "Selling price required.",
        invalid_type_error: "Selling price must be a number",
      }),
      z.number(),
    ])
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Sell Price must be a Positive number",
    }),
  [MaterailEnum.ID]: z.string().optional(),
});

export const materialSchema = z
  .object({
    [MaterailEnum.MATERIAL_NAME]: z
      .string({
        required_error: "Material name required.",
        invalid_type_error: "Material name must be string.",
      })
      .min(3, {
        message: "Material name must be at least 3 characters.",
      }),
    [MaterailEnum.STOCK]: z
      .union([z.string(), z.number()])
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Stock must be a Positive number",
      }),
    [MaterailEnum.STOCK_UNITS]: z.enum(["meters", "units"], {
      required_error: "Stock units required",
      invalid_type_error: "Please select the valid stock.",
    }),
    [MaterailEnum.CATEGORY]: z.enum(["plumber", "electrical", "carpentors"], {
      required_error: "Category is required.",
      invalid_type_error: "Invalid category.",
    }),
  })
  .merge(pricesSchema);

export const materialDataSchema = z.object({
  data: z.array(materialSchema),
  page: z
    .number()
    .int()
    .nonnegative({ message: "page must be a Positive integer" }),
  perPage: z
    .number()
    .int()
    .nonnegative({ message: "Per page must be a Positive integer" }),
  totalCount: z
    .number()
    .int()
    .nonnegative({ message: "Total count must be a Positive integer" }),
  totalPages: z
    .number()
    .int()
    .nonnegative({ message: "Total pages must be a Positive integer" }),
});

export const salesSchema = z
  .object({
    [MaterailEnum.QUANTITY]: z
      .string({
        required_error: "Quantity required.",
        invalid_type_error: "Quantity must be a number.",
      })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be a positive number",
      }),
    [MaterailEnum.MATERIAL_ID]: z
      .string({
        required_error: "Material ID is required",
        invalid_type_error: "Invalid materail ID",
      })
      .min(1, {
        message: "Material ID is required",
      }),
  })
  .merge(pricesSchema);

export enum SearchParamsEnum {
  SEARCH = "search",
  PAGE = "page",
  PER_PAGE = "per_page",
  CATEGORY = MaterailEnum.CATEGORY,
}

export const searchParamsSchema = z.object({
  [SearchParamsEnum.SEARCH]: z.string().optional().default(""),
  [SearchParamsEnum.PAGE]: z.coerce.number().int().positive().default(1),
  [SearchParamsEnum.PER_PAGE]: z.coerce.number().int().positive().default(10),
  // [SearchParamsEnum.CATEGORY]: z.enum(["plumber", "electrical", "carpentors"]).optional(),
  [SearchParamsEnum.CATEGORY]: z.union([
    z.array(z.enum(["plumber", "electrical", "carpentors"])).optional(),
    z.enum(["plumber", "electrical", "carpentors"]).optional(),
  ]),
});

export const staleTime = 1 * 60 * 60 * 1000;