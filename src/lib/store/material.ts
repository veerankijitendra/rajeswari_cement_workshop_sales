import { create } from "zustand";
import { TMaterialResponse, TMaterialInput, TSalesResponse } from "../types";

interface MaterialState {
  inventory: TMaterialResponse;
  updateInventory: (data: TMaterialResponse) => void;
}

interface SalesState {
  sales: TSalesResponse,
  updateSales: (data: TSalesResponse) => void;
}

interface ISingleMaterialState {
  inventory: TMaterialInput | null;
  updateInventory: (data: TMaterialInput) => void;
  resetInventory: () => void;
}

export const useSalesHistory = create<SalesState>((set) => ({
  sales: {
    data: [],
    page: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  },
  updateSales: (sales:TSalesResponse) => (set({sales}))
}))

export const useMaterialStore = create<MaterialState>((set) => ({
  inventory: {
    data: [],
    page: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0,
  },
  updateInventory: (inventory: TMaterialResponse) =>
    set({inventory}),
}));

export const useSingleMaterialStore = create<ISingleMaterialState>((set) => ({
  inventory: null,
  updateInventory: (data: TMaterialInput) =>
    set(() => ({
      inventory: data,
    })),
  resetInventory: () =>
    set(() => ({
      inventory: null,
    })),
}));

interface ILandingPage {
  open: boolean;
  content: React.ReactElement | null;
  openModel: (conent: React.ReactElement) => void;
  closeModel: () => void;
}

export const useModelStore = create<ILandingPage>((set) => ({
  open: false,
  content: null,
  openModel: (content) => {
    set({ content, open: true });
  },
  closeModel: () => {
    set({ content: null, open: false })},
}));
