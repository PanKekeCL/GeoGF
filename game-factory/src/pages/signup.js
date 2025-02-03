import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Header from '../components/header';
import { useAuth } from '../context/useAuth';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [errores, setErrores] = useState({});
  const { registerAdmin, loading } = useApi();
  const { login } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /[A-Za-z]/.test(password) && /\d/.test(password) && password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresTemp = {};

    if (!nombre.trim()) {
      erroresTemp.nombre = 'El nombre es obligatorio.';
    }
    if (!validateEmail(correo)) {
      erroresTemp.correo = 'Ingresa un correo válido.';
    }
    if (!validatePassword(contrasena)) {
      erroresTemp.contrasena =
        "La contraseña debe incluir 8 caracteres, letras y números.";
    }
    setErrores(erroresTemp);

    if (Object.keys(erroresTemp).length > 0) return;

    const nuevoAdministrador = {
      nombre,
      apellido,
      correo,
      contrasena,
      organizacion,
    };

    console.log("Intentando registro con data: ", nuevoAdministrador)

    try {
      const administradorCreado = await registerAdmin(nuevoAdministrador);
      alert('Administrador creado con éxito');
      await login(administradorCreado);
    } catch (err) {
      console.error('Error al crear administrador:', err);
      alert('Error al crear administrador.');
    }
  };

  return (
    <div>
      <Header hideSignup={true} />
      <div className="h-screen flex items-center justify-center bg-orange-400">
        <div className="mt-20 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center">Regístrate gratis</h1>
          <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="nombre" className="sr-only">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Nombre"
                />
                {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
              </div>
              <div>
                <label htmlFor="apellido" className="sr-only">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Apellido (opcional)"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Correo electrónico"
                />
                {errores.correo && <p className="text-red-500 text-sm mt-1">{errores.correo}</p>}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Contraseña"
                />
                {errores.contrasena && <p className="text-red-500 text-sm mt-1">{errores.contrasena}</p>}
              </div>
              <div>
                <label htmlFor="organization" className="sr-only">Organización</label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={organizacion}
                  onChange={(e) => setOrganizacion(e.target.value)}
                  className="appearance-none rounded-md block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-lg text-gray-900 focus:outline-none focus:ring-green-500 focus:border-orange-400"
                  placeholder="Organización (opcional)"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-gray-800 bg-[#97F218] hover:bg-[#87d916] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
