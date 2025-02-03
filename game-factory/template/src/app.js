import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Importar paginas estaticas.
import Menu from "./pages/menu";
import Map from "./pages/map";

// Importar paginas dinamicas (minijuegos).
const importMinigames = () => {
  const minigames = {};
  const context = require.context("./pages/minigames", false, /\.js$/); // Buscar archivos .js en minigames
  context.keys().forEach((key) => {
    const name = key.replace("./", "").replace(".js", "");
    minigames[name] = context(key).default;
  });
  return minigames;
};

const App = () => {
  const minigames = importMinigames();

  return (
    <Router>
      <div>
        <h1>App con Rutas Dinámicas</h1>

        {/* Navegación */}
        <nav>
          <ul>
            <li>
              <Link to="/">Menu</Link>
            </li>
            <li>
              <Link to="/map">Map</Link>
            </li>
            {Object.keys(minigames).map((name) => (
              <li key={name}>
                <Link to={`/minigames/${name}`}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Rutas */}
        <Routes>
          {/* Rutas estáticas */}
          <Route path="/" element={<Menu />} />
          <Route path="/map" element={<Map />} />

          {/* Rutas dinámicas para minijuegos */}
          {Object.entries(minigames).map(([name, Component]) => (
            <Route key={name} path={`/minigames/${name}`} element={<Component />} />
          ))}

          {/* Ruta por defecto para no encontradas */}
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
