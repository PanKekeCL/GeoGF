// Trivia.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Trivia = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const finishTrivia = () => {
    navigate(`/result/${timer}`);
  };

  return (
    <div>
      <h2>Temporizador: {formatTime(timer)}</h2>
      <h3>Pregunta: ¿Cuál es la capital de Francia?</h3>
      <button onClick={finishTrivia}>París</button>
      <button onClick={finishTrivia}>Londres</button>
      <button onClick={finishTrivia}>Madrid</button>
      <button onClick={finishTrivia}>Berlín</button>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default Trivia;
