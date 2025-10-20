import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface MyItemsContextType {
  items: Record<string, any>;
  setItems: Dispatch<SetStateAction<Record<string, any>>>;
  socket: {psocket:string,msocket:string};
  setSocket: Dispatch<SetStateAction<{psocket:string,msocket:string}>>;
  powerconsum: number;
  setpowerconsum: Dispatch<SetStateAction<number>>;
  price: number;
  setprice: Dispatch<SetStateAction<number>>;
  currentshow: string;
  setcurrentshow: Dispatch<SetStateAction<string>>;
  ramtype: string;
  setramtype: Dispatch<SetStateAction<string>>;
}

export const myItemsContext = createContext<MyItemsContextType>({
  items: {},
  setItems: () => {},
  socket: {psocket:'all',msocket:'all'},
  setSocket: () => {},
  powerconsum: 0,
  setpowerconsum: () => {},
  price: 0,
  setprice: () => {},
  currentshow: 'cpu',
  setcurrentshow: () => {},
  ramtype: 'all',
  setramtype: () => {}
});

export const MyItemsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState({});
    let [socket, setSocket] = useState({psocket:'all',msocket:'all'});
    let [powerconsum, setpowerconsum]=useState(0);
    let [price, setprice]=useState(0);
    let [currentshow,setcurrentshow]=useState('cpu');
    let [ramtype,setramtype]=useState('all');
  return (
    <myItemsContext.Provider value={{
      items, 
      setItems, 
      socket, 
      setSocket,
      powerconsum, 
      setpowerconsum, 
      price, 
      setprice,
      currentshow, 
      setcurrentshow,
      ramtype,
      setramtype
    }}>
      {children}
    </myItemsContext.Provider>
  );
};