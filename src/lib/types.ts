import {z} from "zod";
import { Document } from "mongoose";
import { materialSchema, salesSchema, searchParamsSchema} from "@/lib/resource";




export interface IMaterial extends Document, Omit<TMaterialInput, "id"> {
}
// export type TMaterialInput = Pick<IMaterial, MaterailEnum.MATERIAL_NAME | MaterailEnum.PRICE | MaterailEnum.SELL_PRICE | MaterailEnum.STOCK| MaterailEnum.STOCK_UNITS| MaterailEnum.CATEGORY> ;

export type TMaterialInput = z.infer<typeof materialSchema>;

export type TFormMaterialInput = Omit<TMaterialInput, "_id">;


export type TMaterialResponse = {
  data: TMaterialInput[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
};

// All sales related types
export interface ISales extends Document, Omit<TSalesInput, "id"> {

}

export type TSalesInput = z.infer<typeof salesSchema>;

export type TSalesDataResponse = {
   price: number;
        quantity: number;
        sellPrice: number;
        createdAt: string;
        id: string;
        materialName: string;
}

export type TSalesResponse = {
  data: TSalesDataResponse[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export type TSearchParams = z.infer<typeof searchParamsSchema>;