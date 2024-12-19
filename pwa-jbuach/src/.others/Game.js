// Game.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la Trivia</h1>
      <Link to="/trivia">
        <button>Start</button>
      </Link>
    </div>
  );
};

export default Home;
