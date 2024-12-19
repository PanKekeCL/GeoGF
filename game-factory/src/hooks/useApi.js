import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const hashPassword = async (password) => {
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);  // Usar SHA-256 de crypto-js
    console.log("Contraseña Hasheada:", hashedPassword);
    return hashedPassword;
};

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const registerAdmin = async (nuevoAdministrador) => {
        setLoading(true);
        setError(null);
        try {
            // Paso 1: Hashear la contraseña.
            const hashedPassword = await hashPassword(nuevoAdministrador.contrasena);
            const apiData = { ...nuevoAdministrador, contrasena: hashedPassword };
            // Paso 2: Registrar al usuario con la API.
            const response = await axios.post(`${API_BASE_URL}/signup`, apiData);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Error de conexión");
            console.error("HOOK - Error en signup:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async (Administrador) => {
        setLoading(true);
        setError(null);
        try {
            // Paso 1: Hashear la contraseña.
            const hashedPassword = await hashPassword(Administrador.contrasena);
            const apiData = { ...Administrador, contrasena: hashedPassword };
            // Paso 2: Logear el usuario con la API.
            const response = await axios.post(`${API_BASE_URL}/login`, apiData);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : err.message);
            console.error("HOOK - Error en login:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMinijuegosByAdminID = async (id_administrador) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/minijuegos/administrador/${id_administrador}`);
            return response.data;
        } catch (error) {
            console.error("Error en getMinijuegosByAdminID:", error.message);
            if (error.response && error.response.status === 404) {
                console.warn("No se encontraron minijuegos para este administrador.");
                return []; // Retornar una lista vacía si el recurso no existe
            }
            return []
            throw error; // Volver a lanzar el error para que pueda ser manejado por quien llame esta función
        } finally {
            setLoading(false);
        }
    };

    // Función para crear o actualizar un minijuego
    const saveMinijuego = async (minijuego) => {
        setLoading(true);
        setError(null);

        try {
            // Agregar datos del usuario y la fecha actual de modificación
            console.log("Enviando a la API: ", minijuego);
            let response;
            // Si el minijuego no tiene ID, lo creamos; si tiene, lo actualizamos
            if (!minijuego._id) {
                // Crear un nuevo minijuego
                response = await axios.post(`${API_BASE_URL}/minijuegos`, minijuego);
            } else {
                // Actualizar un minijuego existente
                response = await axios.put(`${API_BASE_URL}/minijuegos/${minijuego._id}`, minijuego);
            }
            console.log("Hook recibio: ", response.data)
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Error de conexión");
            console.error("Error al guardar el minijuego:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMinijuegoByID = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/minijuego/${id}`);
            console.log("Obtuve el siguiente minijuego: ", response.data)
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Error de conexión");
            console.error("Error al buscar minijuego con ID:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteMinijuegoByID = async (id) => {
        try {
          const response = await axios.delete(`${API_BASE_URL}/minijuegos/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error al eliminar el minijuego:", error);
          throw new Error("No se pudo eliminar el minijuego.");
        }
      };

      const getProyectosByAdminID = async (id_administrador) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/proyectos/administrador/${id_administrador}`);
            return response.data;
        } catch (error) {
            console.error("Error en getProyectosByAdminID:", error.message);
            if (error.response && error.response.status === 404) {
                console.warn("No se encontraron proyectos para este administrador.");
                return []; // Retornar una lista vacía si el recurso no existe
            }
            return []
            throw error; // Volver a lanzar el error para que pueda ser manejado por quien llame esta función
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener un minijuego especifico
    const getProyectoByID = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/proyecto/${id}`);
            console.log("Obtuve el siguiente proyecto: ", response.data)
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Error de conexión");
            console.error("Error al buscar proyecto con ID:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para crear o actualizar un minijuego
    const saveProyecto = async (proyecto) => {
        setLoading(true);
        setError(null);

        try {
            // Agregar datos del usuario y la fecha actual de modificación
            console.log("Enviando a la API: ", proyecto);
            let response;
            // Si el minijuego no tiene ID, lo creamos; si tiene, lo actualizamos
            if (!proyecto._id) {
                // Crear un nuevo minijuego
                response = await axios.post(`${API_BASE_URL}/proyectos`, proyecto);
            } else {
                // Actualizar un minijuego existente
                response = await axios.put(`${API_BASE_URL}/proyectos/${proyecto._id}`, proyecto);
            }
            console.log("Hook recibido: ", response.data)
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Error de conexión");
            console.error("Error al guardar el proyecto:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { registerAdmin, loginAdmin, getMinijuegosByAdminID, saveMinijuego, getMinijuegoByID, deleteMinijuegoByID, getProyectosByAdminID, getProyectoByID, saveProyecto, loading, error };
};
