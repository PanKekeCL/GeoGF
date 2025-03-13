import React, { useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import Header from '../components/header';
import './home.css';

const Home = () => {

    useEffect(() => {
        document.title = 'Game Factory';
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col">
          {/* Header */}
          <Header />

          {/* Contenedor principal de la página */}
          <div className="h-full w-full flex items-center justify-center relative">

            {/* Imagen a la izquierda (50% de la pantalla) */}
            <div className="h-full w-1/2 bg-cover bg-center absolute top-0 left-0 z-0"
                 style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/frutas.jpg)` }}></div>

            {/* Título y botón centrado en la parte izquierda */}
            <div className="absolute left-[12%] z-20 text-center text-white">
              <h1 className="text-6xl mb-6 font-extrabold">Game Factory</h1>
              <Link to="/menu">
                <button className="p-4 bg-blue-500 hover:bg-blue-700 text-white rounded text-xl">Iniciar</button>
              </Link>
            </div>

            {/* Sección Naranja a la derecha */}
            <div className="h-full w-1/2 bg-orange-500 absolute top-0 right-0 flex flex-col justify-center items-center text-white p-8">
              <h2 className="text-2xl font-bold mb-4">¿Quién somos?</h2>
              <p className="mb-6 text-center">
                El equipo del proyecto GeoParques busca ofrecer soluciones tecnológicas a parques turísticos.
              </p>
              <h2 className="text-2xl font-bold mb-4">¿Qué es GeoGF?</h2>
              <p className="text-center">
                Es una herramienta de tipo Game Factory que permite crear minijuegos para los visitantes de parques turísticos.
              </p>
            </div>

          </div>
        </div>
    );
};

export default Home;
