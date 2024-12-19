import React from 'react';
import Header from '../components/header';
import Actions from '../components/actions';
import YourDesigns from '../components/yourDesigns';

const Menu = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="h-[12vh]">
        <Header />
      </div>

      {/* Body */}
      <div className="h-[88vh] w-full py-1.5 flex gap-[5px] overflow-hidden">
        {/* Acciones principales a la izquierda */}
        <div className="w-1/3 h-full overflow-auto">
          <Actions />
        </div>

        {/* Listas principales a la derecha */}
        <div className="w-2/3 h-full overflow-auto">
          <YourDesigns />
        </div>
      </div>
    </div>
  );
};

export default Menu;
