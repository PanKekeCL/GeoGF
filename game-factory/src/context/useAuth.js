import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            console.log('Usuario encontrado en localStorage:', JSON.parse(savedUser));
        } else {
            console.log('No se encontró usuario en localStorage.');
        }
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Iniciar sesión
const login = (userData) => {
    if (!userData) {
        console.error('Error: Datos de usuario no proporcionados a login');
        return;
    }
    console.log('Datos de usuario recibidos en login:', userData);
    setUser(userData); // Guardar los datos del usuario en el estado
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
};

// Cerrar sesión
const logout = () => {
    console.log('Cerrando sesión, eliminando usuario...');
    setUser(null); // Eliminar los datos del usuario del estado
    localStorage.removeItem('user'); // Eliminar de localStorage
};

    // Determinar si hay un usuario autenticado
    const isAuthenticated = !!user;

    // Persistir el usuario al cambiar (opcional, ya que usamos `localStorage` en login/logout)
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
};
