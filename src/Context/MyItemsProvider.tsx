import { useState } from "react";
import { MyItemsContext } from "./myItemsContext";

export const MyItemsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState({});
  const [socket, setSocket] = useState({ pSocket: "all", mSocket: "all" });
  const [powerconsum, setpowerconsum] = useState(0);
  const [price, setprice] = useState(0);
  const [currentshow, setcurrentshow] = useState("CPUs");
  const [ramtype, setramtype] = useState("all");
  return (
    <MyItemsContext.Provider
      value={{
        items,
        setItems,
        socket,
        setSocket,
        powerConsumption: powerconsum,
        setPowerConsumption: setpowerconsum,
        price,
        setPrice: setprice,
        currentShow: currentshow,
        setCurrentShow: setcurrentshow,
        ramType: ramtype,
        setRamType: setramtype,
      }}
    >
      {children}
    </MyItemsContext.Provider>
  );
};
