import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const hashPassword = async (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const registerAdmin = async (newAdmin) => {
        setLoading(true);
        setError(null);
        try {
            // Step 1: Hash the password.
            const hashedPassword = await hashPassword(newAdmin.password);
            const apiData = { ...newAdmin, password: hashedPassword };
            // Step 2: Register the user with the API.
            const response = await axios.post(`${API_BASE_URL}/signup`, apiData);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Connection error");
            console.error("HOOK - Error in signup:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async (admin) => {
        setLoading(true);
        setError(null);
        try {
            // Step 1: Hash the password.
            const hashedPassword = await hashPassword(admin.password);
            const apiData = { ...admin, password: hashedPassword };
            // Step 2: Log in the user with the API.
            const response = await axios.post(`${API_BASE_URL}/login`, apiData);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : err.message);
            console.error("HOOK - Error in login:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMinigamesByAdminID = async (adminId) => {
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/minigames/admin_id/${adminId}`);
            return response.data;
        } catch (error) {
            console.error("Error in getMinigamesByAdminID:", error.message);
            if (error.response && error.response.status === 404) {
                console.warn("No minigames found for this admin.");
                return []; // Return an empty list if the resource does not exist
            }
            return [];
        }
    };

    const saveMinigame = async (minigame) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Sending to API: ", minigame);
            let response;
            if (!minigame._id) {
                response = await axios.post(`${API_BASE_URL}/minigames`, minigame);
            } else {
                response = await axios.put(`${API_BASE_URL}/minigames/${minigame._id}`, minigame);
            }
            console.log("Hook received: ", response.data);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Connection error");
            console.error("Error saving the minigame:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMinigameByID = async (id) => {
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/minigames/${id}`);
            console.log("Retrieved minigame: ", response.data);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Connection error");
            console.error("Error fetching minigame by ID:", err);
            throw err;
        }
    };

    const deleteMinigameByID = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/minigames/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting the minigame:", error);
            throw new Error("Failed to delete the minigame.");
        }
    };

    const getProjectsByAdminID = async (adminId) => {
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/admin_id/${adminId}`);
            return response.data;
        } catch (error) {
            console.error("Error in getProjectsByAdminID:", error.message);
            if (error.response && error.response.status === 404) {
                console.warn("No projects found for this admin.");
                return [];
            }
            return [];
        }
    };

    const getProjectByID = async (id) => {
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
            console.log("Retrieved project: ", response.data);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Connection error");
            console.error("Error fetching project by ID:", err);
            throw err;
        }
    };

    const saveProject = async (project) => {
        setLoading(true);
        setError(null);
        try {
            console.log("Sending to API: ", project);
            let response;
            if (!project._id) {
                response = await axios.post(`${API_BASE_URL}/projects`, project);
            } else {
                response = await axios.put(`${API_BASE_URL}/projects/${project._id}`, project);
            }
            console.log("Hook received: ", response.data);
            return response.data;
        } catch (err) {
            setError(err.response ? err.response.data.detail : "Connection error");
            console.error("Error saving the project:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProjectByID = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.delete(`${API_BASE_URL}/projects/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting the project:", error);
            throw new Error("Failed to delete the project.");
        }
        finally {
            setLoading(false);
        }
    };

    const buildProject = async (project) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/build`, project);
            return response.data;
        } catch (error) {
            console.error("Error building the project:", error);
            setError("No se pudo construir el proyecto");
        } finally {
            setLoading(false);
        }
    };

    return {
        registerAdmin,
        loginAdmin,
        getMinigamesByAdminID,
        saveMinigame,
        getMinigameByID,
        deleteMinigameByID,
        getProjectsByAdminID,
        getProjectByID,
        saveProject,
        deleteProjectByID,
        buildProject,
        loading,
        error,
    };
};
