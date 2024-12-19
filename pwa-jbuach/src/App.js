import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mapa from './pages/Mapa';
import Minijuego from './pages/Minijuego';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Mapa />} />
        <Route path="/minigame" element={<Minijuego />} />
      </Routes>
    </Router>
  );
}

export default App;
