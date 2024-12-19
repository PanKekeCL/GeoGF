// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Cambié Switch por Routes
import Trivia from './Trivia';
import Result from './Result';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/trivia" component={Trivia} />
        <Route path="/result/:time" component={Result} />
      </Routes>
    </Router>
  );
};

export default App;
