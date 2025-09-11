import axios, { type AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import eventBus from "helpers/eventBus";

// Validar que la variable de entorno esté definida
const URL_BASE = import.meta.env.VITE_SERVER;
if (!URL_BASE) {
	throw new Error("VITE_SERVER no está definido en las variables de entorno.");
}

// ============================================================================
// 								Crear una instancia de Axios tipada
// ============================================================================
const axiosInstance: AxiosInstance = axios.create({
	baseURL: URL_BASE,
	timeout: 10000,
	headers: {
		Accept: "application/json",
	},
});

// ============================================================================
// 								INTERCEPTOR
// ============================================================================
axiosInstance.interceptors.request.use(async (req) => {
	const accessToken = localStorage.getItem("token")
		? JSON.parse(localStorage.getItem("token") || "")
		: null;

	if (!accessToken) {
		return req; // No token, probablemente una ruta pública.
	}

	const payloadUser = jwtDecode<{ exp: number }>(accessToken);
	const isExpired = dayjs.unix(payloadUser.exp).diff(dayjs()) < 1;

	if (!isExpired) {
		req.headers.Authorization = `Bearer ${accessToken}`;
		return req;
	}

	// El token ha expirado, intentemos refrescarlo.
	const refreshToken = localStorage.getItem("refreshToken")
		? JSON.parse(localStorage.getItem("refreshToken") || "")
		: null;

	if (!refreshToken) return req; // No hay refresh token disponible.

	try {
		const response = await axiosInstance.post(
			`${URL_BASE}/auth/refresh-token`,
			{
				accessToken,
				refreshToken,
			}
		);

		const newAccessToken = response.data.accessToken;
		localStorage.setItem("token", JSON.stringify(newAccessToken));
		eventBus.dispatch("tokenRefreshed", { token: newAccessToken });
		req.headers.Authorization = `Bearer ${newAccessToken}`;
		return req;
	} catch (error) {
		console.error("No se pudo refrescar el token.", error);
		// El refresh token expiró o es inválido. Limpiamos todo.
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userProfile");
		eventBus.dispatch("logout"); // Notificamos al AuthContext para que limpie su estado.
		window.location.href = "/auth/signin"; // Redirigimos al login.
		return Promise.reject(error);
	}
});

export default axiosInstance;
