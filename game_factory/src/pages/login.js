import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import HideIcon from '../assets/icons/hideIcon';
import ShowIcon from '../assets/icons/showIcon';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false); // Estado para la visibilidad
  const [errores, setErrores] = useState({ correo: '', contrasena: '' });
  const [errorGeneral, setErrorGeneral] = useState('');

  const { loginAdmin, loading } = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleMostrarContrasena = () => setMostrarContrasena(!mostrarContrasena);

  const validarCorreo = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarContrasena = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const nuevosErrores = { correo: '', contrasena: '' };

    if (!correo || !validarCorreo(correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido.';
      valid = false;
    }

    if (!contrasena || !validarContrasena(contrasena)) {
      nuevosErrores.contrasena =
        'La contraseña debe incluir 8 caracteres, letras y números.';
      valid = false;
    }

    setErrores(nuevosErrores);

    if (!valid) return;

    try {
      const adminData = { correo, contrasena };
      const response = await loginAdmin(adminData);
      login(response.data);
      navigate('/home');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setErrorGeneral('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div>
      <Header hideLogin={true} />
      <div className="h-screen flex items-center justify-center bg-orange-400">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mt-16">
          <h1 className="text-4xl font-bold text-center">Inicia Sesión</h1>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errores.correo && (
                  <p className="text-red-500 text-sm mt-1">{errores.correo}</p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type={mostrarContrasena ? 'text' : 'password'}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleMostrarContrasena}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
                >
                  {mostrarContrasena ? <HideIcon color="#444444" size={24}/> : <ShowIcon color="#444444" size={24}/>}
                </button>
                {errores.contrasena && (
                  <p className="text-red-500 text-sm mt-1">
                    {errores.contrasena}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-gray-800 ${
                  loading
                    ? 'bg-gray-500'
                    : 'bg-[#97F218] hover:bg-[#87d916]'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
          {errorGeneral && (
            <p className="text-red-500 text-center text-base mt-4">
              {errorGeneral}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
