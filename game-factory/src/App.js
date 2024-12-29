// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Menu from './pages/menu';
import Login from './pages/login';
import Signup from './pages/signup';
import Minigame from './pages/minigame';
import Project from './pages/project';
import Build from './pages/build';
import { useAuth } from './context/useAuth';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Estas rutas están protegidas */}
        <Route path="/menu" element={<PrivateRoute element={<Menu />} />} />
        <Route path="/minigame" element={<PrivateRoute element={<Minigame />} />} />
        <Route path="/build" element={<PrivateRoute element={<Build />} />} />
        <Route path="/project" element={<PrivateRoute element={<Project />} />} />
      </Routes>
    </Router>
  );
}

export default App;
