import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { myItemsContext } from '../../Context/myItems'
// import { Motherboards } from '@/lib/constants';
import { useContext } from 'react'
export default function Sidebar() {
    const { setcurrentshow, items,setItems,setSocket,setramtype } = useContext(myItemsContext);


    // handeler functions
    function removeItem(product:any){
     // setItems((prev: Record<string, any>) => ({ ...prev, [currentshow]: undefined }));
     // console.log(product)
    //  console.log(currentshow)
     if(product.category === "CPU"){
      //let previtems=Object.keys(items).filter((item:any)=>item!="CPU")
      setItems((prev:any)=>({...prev,CPU:undefined}))
      setSocket((prev:any)=>({...prev,psocket:'all'}))
      if(items.Motherboard==undefined){
        setramtype('all')
      }
    }
    if(product.category === "Motherboard"){
    //  let previtems=Object.keys(items).filter((item:any)=>item!="Motherboard")
      setItems((prev)=>({...prev,Motherboard:undefined}))
      setSocket((prev)=>({...prev,msocket:'all'}))
      if(items.CPU==undefined){
        setramtype('all')
      }
    }else if(product.category=='RAM'){
      setItems((prev:any)=>({...prev,RAM:undefined}))
      if(items.Motherboard==undefined&&items.CPU==undefined){
      setramtype('all')
      }
    }else{
      setItems((prev:any)=>({...prev,[product.category]:undefined}))
    }
   // console.log(items)
    }
  return (
    <aside className="sticky top-6 hidden md:block">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Components</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-1">
            {[{show:'CPU',filter:'CPUs'},
             {show:'GPU',filter:'GPUs'},
              {show:'Motherboard',filter:'Motherboards'},
               {show:'RAM',filter:'ramKits'},
                {show:'Power Supply',filter:'PowerSupply'},
                 {show:'Case',filter:'pcCases'}].map((item) => (
              <div
                style={{cursor:'pointer'}}
                key={item.filter}
                className="w-full text-left rounded-md px-3 py-2 text-sm bg-muted/40"
                onClick={()=>{setcurrentshow(item.filter)}}
              >
                {item.show}
              </div>
            ))}
          </nav>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Selected</div>
            <div className="space-y-1">
              {Object.keys(items).length === 0 ? (
                <div className="text-xs text-muted-foreground">No items selected</div>
              ) : (
                Object.entries(items).map(([category, product]: any) =>{ if(product!=undefined){ return(
                  <div key={category} className="text-xs flex justify-between items-center bg-muted/30 rounded px-2 py-1" onClick={()=>{removeItem(product)}}>
                    <span className="font-medium">{category}</span>
                    <span className="truncate ml-2">{product?.name}</span>
                  </div>
                )}})
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}