import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Menu from "./pages/menu";
import Map from "./pages/map";
import List from "./pages/list";

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
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/map" element={<Map />} />
        <Route path="/list" element={<List />} />

        {/* Rutas dinámicas de los minijuegos */}
        {Object.entries(minigames).map(([name, Component]) => (
          <Route key={name} path={`/minigames/${name}`} element={<Component />} />
        ))}

        {/* Ruta por defecto para no encontradas */}
        <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
