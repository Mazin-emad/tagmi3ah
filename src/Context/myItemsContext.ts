import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CpuResponse } from "@/api/product/cpus";
import type { MotherboardResponse } from "@/api/product/motherboards";
import type { RamKitResponse } from "@/api/product/ramkits";
import type { GpuResponse } from "@/api/product/gpus";
import type { PsuResponse } from "@/api/product/psus";
import type { PcCaseResponse } from "@/api/product/pccases";

export type AnyProductResponse =
  | CpuResponse
  | MotherboardResponse
  | RamKitResponse
  | GpuResponse
  | PsuResponse
  | PcCaseResponse;

export interface MyItemsContextType {
  items: Record<string, AnyProductResponse>;
  setItems: Dispatch<SetStateAction<Record<string, AnyProductResponse>>>;
  socket: { pSocket: string; mSocket: string };
  setSocket: Dispatch<SetStateAction<{ pSocket: string; mSocket: string }>>;
  powerConsumption: number;
  setPowerConsumption: Dispatch<SetStateAction<number>>;
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
  currentShow: string;
  setCurrentShow: Dispatch<SetStateAction<string>>;
  ramType: string;
  setRamType: Dispatch<SetStateAction<string>>;
}

export const MyItemsContext = createContext<MyItemsContextType>({
  items: {},
  setItems: () => {},
  socket: { pSocket: "all", mSocket: "all" },
  setSocket: () => {},
  powerConsumption: 0,
  setPowerConsumption: () => {},
  price: 0,
  setPrice: () => {},
  currentShow: "cpu",
  setCurrentShow: () => {},
  ramType: "all",
  setRamType: () => {},
});
