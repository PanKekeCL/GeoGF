import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white fixed top-0 w-full z-10 shadow-lg">
      <nav>
        <ul className="flex space-x-4">
          <div className="text-2xl font-bold">Icono GeoGF</div>
          <li className="cursor-pointer">Quienes somos</li>
          <li className="cursor-pointer">Nuestros Proyectos</li>
        </ul>
      </nav>
      <div className="space-x-4">
        <Link to="/login">
          <button className="border border-gray-300 rounded-md px-4 py-2">Iniciar sesión</button>
        </Link>
        <Link to="/signup">
          <button className="bg-green-500 text-white rounded-md px-4 py-2">Registrarme</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;