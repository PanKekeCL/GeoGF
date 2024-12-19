// Result.js
import React from 'react';
import { useParams } from 'react-router-dom';

const Result = () => {
  const { time } = useParams();

  return (
    <div>
      <h2>¡Felicidades, completaste la trivia!</h2>
      <p>Tiempo total: {formatTime(Number(time))}</p>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default Result;
