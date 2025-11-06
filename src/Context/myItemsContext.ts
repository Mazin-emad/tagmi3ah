import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "@/types";

export interface MyItemsContextType {
  items: Record<string, Product>;
  setItems: Dispatch<SetStateAction<Record<string, Product>>>;
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
