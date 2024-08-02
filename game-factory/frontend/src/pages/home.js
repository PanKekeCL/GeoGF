import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {

    useEffect(() => {
        document.title = 'Game Factory';
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col">
          <header className="flex justify-between items-center p-4 bg-white fixed top-0 w-full z-10 shadow-lg">
            
            <nav>
              <ul className="flex space-x-4">
              <div className="text-2xl font-bold">Icono GeoGF</div>
                <li className="cursor-pointer">Quienes somos</li>
                <li className="cursor-pointer">Nuestros Proyectos</li>
              </ul>
            </nav>
            <div className="space-x-4">
                <button className="border border-gray-300  rounded-md px-4 py-2">Iniciar sesión</button>
                <button className="bg-green-500 text-white rounded-md px-4 py-2">Registrarme</button>
            </div>
          </header>
          <div className="flex-grow flex items-center justify-start bg-cover bg-center" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/008/969/361/small_2x/multi-layers-gray-blue-dark-texture-3d-papercut-layers-in-gradient-banner-abstract-paper-cut-art-background-design-for-website-template-topography-map-concept-or-smooth-origami-paper-cut-vector.jpg')" }}>
            <div className="text-white ml-12">
              <h1 className="text-6xl mb-4">Game Factory</h1>
              <p className="text-2xl mb-4">Herramienta para la creación de juegos en parques turísticos</p>
              <Link to="/designer">
                <button className="p-4 bg-blue-500 hover:bg-blue-700 text-white rounded">Diseñar</button>
              </Link>
            </div>
          </div>
        </div>
      );
    };

export default Home;