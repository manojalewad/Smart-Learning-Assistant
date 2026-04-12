import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
function Applayout({children}) {
  const [issidebaropen,setissidebaropen]=React.useState(true);
  const togglesidebar=()=>{
    setissidebaropen(!issidebaropen);
  }
  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900">
      <Sidebar 
        issidebaropen={issidebaropen} 
        togglesidebar={togglesidebar} 
      />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header togglesidebar={togglesidebar} />

        <main className="flex-1 overflow-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Applayout