import Sidebar from '../components/ui/sidebar'
import { BuilderProductCard } from '@/components/builder/BuilderProductCard'
import {  CPUs, Motherboards, GPUs, ramKits, PowerSupply, pcCases } from '@/lib/constants'
import { useContext } from 'react';
import { myItemsContext } from '@/Context/myItems';
const Builder = () => {
  // ملاحظة: هذه الصفحة الآن "عرض فقط" بدون أي منطق اختيار/تصفية.
  // TODO: اكتب منطقك هنا لاحقًا (تصفية حسب الفئة، اختيار جزء لكل فئة، ...)
  const context = useContext(myItemsContext);
  const { currentshow, socket,ramtype } = context;
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          {/* Sidebar*/}
          <Sidebar />
        </div>
        <div className="md:col-span-9">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold">Build Your PC</h1>
            <p className="text-muted-foreground text-sm">
              {/* TODO: Description */}
              Pick parts to start your custom build.
            </p>
          </header>

          {/* Products */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentshow === 'CPUs' ? CPUs.map((p) => {if((p.socket === socket.msocket || socket.msocket=='all') && ( p.supportedMemoryTypes?.includes(ramtype as any)||ramtype=='all'))
            {return (<BuilderProductCard key={p.id} product={p as any} />  )}}) :
             currentshow === 'GPUs' ? GPUs.map((p) => (
              <BuilderProductCard key={p.id} product={p as any} />
            )) : currentshow === 'Motherboards' ? Motherboards.map((p) => {if((p.socket === socket.psocket || socket.psocket=='all') && ( p.ramType?.includes(ramtype as any)||ramtype=='all')){
              return (<BuilderProductCard key={p.id} product={p as any} />)
            }}) : currentshow === 'ramKits' ? ramKits.map((p) => {if(ramtype === p.type || ramtype=='all'){return(
              <BuilderProductCard key={p.id} product={p as any} />
            )}}) :currentshow === 'PowerSupply' ? PowerSupply.map((p) => (
              <BuilderProductCard key={p.id} product={p as any} />
            )) : currentshow === 'pcCases' ? pcCases.map((p) => (
              <BuilderProductCard key={p.id} product={p as any} />
            )):""}
          </section>
        </div>
      </div>
    </main>
  );
}
;

export default Builder;
