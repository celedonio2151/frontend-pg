import axios, { type AxiosInstance } from "axios";

// Validar que la variable de entorno esté definida
const URL_BASE = import.meta.env.VITE_SERVER;
if (!URL_BASE) {
	throw new Error("VITE_SERVER no está definido en las variables de entorno.");
}

// Crear una instancia de Axios tipada
const axiosInstance: AxiosInstance = axios.create({
	baseURL: URL_BASE,
	timeout: 5000,
	headers: {
		Accept: "application/json",
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default axiosInstance;
