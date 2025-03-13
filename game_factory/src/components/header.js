import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Header = ({ hideLogin, hideSignup }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  console.log("Usuario detectado:", user);

  return (
    <header className="z-[99] flex items-center justify-between h-[12vh] w-full px-5 bg-white fixed top-0 shadow">
      {/* Logo e ícono a la izquierda */}
      <div className="flex items-center space-x-2">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            src="/rebanada_pomelo3.png"
            alt="Game Factory"
            className="h-[7vh] w-auto"
          />
          <span className="text-2xl font-bold">
            <span className="text-[#f24f18]">Geo</span>
            <span className="text-[#f2184f]">GF</span>
          </span>
        </Link>
      </div>

      {/* Sección de usuario a la derecha */}
      <div className="space-x-4 flex items-center">
        {user ? (
          <div className="flex items-center space-x-4 relative">
            {/* Nombre del usuario */}
            <span className="font-semibold text-gray-800">{user.nombre}</span>

            {/* Imagen de perfil como botón */}
            <div className="relative">
              <img
                src={user.imagen || '/imagenAdministrador.png'}
                alt="Perfil"
                className="w-12 h-12 rounded-full border cursor-pointer"
                onClick={toggleMenu}
              />

              {/* Menú desplegable */}
              {menuOpen && (
                <div className="absolute -right-2 top-20 w-60 bg-white border rounded-lg shadow-lg z-10">
                  {/* Información del usuario */}
                  <div className="flex flex-col space-y-2 items-center p-4 border-b">
                    <span className={`text-center font-semibold ${user.nombre || user.apellido ? 'text-gray-800' : 'text-gray-400'}`}>
                      {user.nombre || user.apellido ? `${user.nombre || ''} ${user.apellido || ''}` : 'Sin nombre'}
                    </span>
                    <img
                      src={user.imagen || '/imagenAdministrador.png'}
                      alt="Perfil"
                      className="w-20 h-20 rounded-full border mb-2"
                    />
                  </div>

                  {/* Opciones del menú */}
                  <button
                    className="block w-full text-left p-4 text-sm hover:bg-gray-100"
                    onClick={() => console.log("Falta la funcion Administrar Cuenta")}
                  >
                    Administra tu cuenta
                  </button>
                  <button
                    onClick={logout}
                    className="block rounded-b-lg w-full text-left p-4 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="flex space-x-4 text-gray-800">
            {/* Si hideLogin es false, mostrar el botón de login */}
            {!hideLogin && (
              <Link to="/login">
                <button className="border border-gray-200 bg-white hover:bg-[#e6e6e6] h-12 font-bold rounded-md px-4 py-2">
                  Iniciar sesión
                </button>
              </Link>
            )}

            {/* Si hideSignup es false, mostrar el botón de signup */}
            {!hideSignup && (
              <Link to="/signup">
                <button className="bg-[#97F218] hover:bg-[#87d916] h-12 font-bold rounded-md px-4 py-2">
                  Registrarse
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
