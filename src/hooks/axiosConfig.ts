import axios from "axios";

const URL_BASE = import.meta.env.VITE_SERVER;

// Crear una instancia de Axios
const axiosInstance = axios.create({
	baseURL: URL_BASE,
	timeout: 5000,
	// Configuración de cabeceras por defecto
	headers: {
		Accept: "application/json",
	},
});
export default axiosInstance;
