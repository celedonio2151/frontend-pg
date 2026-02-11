import axios, { type AxiosInstance } from "axios";

const URL_BASE = import.meta.env.VITE_SERVER;

// Crear instancia de Axios con configuración base
// Los interceptores se configuran en AuthContext para tener acceso al estado de autenticación
const axiosInstance: AxiosInstance = axios.create({
	baseURL: URL_BASE,
	timeout: 10000,
	headers: { Accept: "application/json" },
	withCredentials: true,
});

export default axiosInstance;
