import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

import type { User } from "interfaces/Profile.interface";
import axiosInstance from "hooks/axiosConfig";

// Definir las propiedades del contexto
interface AuthContextProps {
	token: string | undefined;
	refreshToken: string | undefined;
	userProfile: User | undefined;
	loading: boolean;
	setToken: (token: string) => Promise<void>;
	setRefreshToken: (token: string) => Promise<void>;
	setProfile: (profile: User) => Promise<void>;
	logout: () => void;
}

// Crear un contexto con un valor inicial nulo
const AuthContext = createContext<AuthContextProps | null>(null);

// URL base del servidor
const URL_BASE = import.meta.env.VITE_SERVER;

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setTokenState] = useState<string | undefined>(undefined);
	const [refreshToken, setRefreshTokenState] = useState<string | undefined>(
		undefined,
	);
	const [userProfile, setUserProfile] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const { enqueueSnackbar } = useSnackbar();

	// Referencias para evitar closures obsoletos en los interceptores
	const tokenRef = useRef<string | undefined>(undefined);
	const refreshTokenRef = useRef<string | undefined>(undefined);

	// Para evitar múltiples refreshes simultáneos
	const isRefreshing = useRef(false);
	const failedQueue = useRef<
		Array<{
			resolve: (token: string) => void;
			reject: (error: unknown) => void;
		}>
	>([]);

	// Actualizar refs cuando cambian los tokens
	useEffect(() => {
		tokenRef.current = token;
	}, [token]);

	useEffect(() => {
		refreshTokenRef.current = refreshToken;
	}, [refreshToken]);

	// Función para procesar la cola de peticiones fallidas
	const processQueue = useCallback(
		(error: unknown, newToken: string | null = null) => {
			failedQueue.current.forEach((prom) => {
				if (newToken) {
					prom.resolve(newToken);
				} else {
					prom.reject(error);
				}
			});
			failedQueue.current = [];
		},
		[],
	);

	// Función para cerrar sesión (definida antes del interceptor)
	const logout = useCallback(() => {
		setTokenState(undefined);
		setRefreshTokenState(undefined);
		setUserProfile(undefined);
		tokenRef.current = undefined;
		refreshTokenRef.current = undefined;
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userProfile");
		enqueueSnackbar(
			"Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
			{
				variant: "warning",
			},
		);
	}, [enqueueSnackbar]);

	// Configurar interceptores de Axios
	useEffect(() => {
		// Request Interceptor - Añadir token a cada request
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config) => {
				const storedToken = localStorage.getItem("accessToken");
				if (storedToken) {
					config.headers.Authorization = `Bearer ${JSON.parse(storedToken)}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response Interceptor - Manejar 401 y refresh token
		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				// Si el error es 401 y no es un retry
				if (error.response?.status === 401 && !originalRequest._retry) {
					// Si ya hay un refresh en progreso, encolar esta petición
					if (isRefreshing.current) {
						return new Promise((resolve, reject) => {
							failedQueue.current.push({ resolve, reject });
						}).then((newToken) => {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return axiosInstance(originalRequest);
						});
					}

					originalRequest._retry = true;
					isRefreshing.current = true;

					try {
						const storedRefreshToken = localStorage.getItem("refreshToken");
						const storedToken = localStorage.getItem("accessToken");
						if (!storedRefreshToken || !storedToken) {
							throw new Error("Refresh token o access token no disponible");
						}

						// Llamar al endpoint de refresh usando axios puro (no axiosInstance)
						// para evitar el interceptor
						const response = await axios.post(
							`${URL_BASE}/auth/refresh-token`,
							{
								accessToken: JSON.parse(storedToken),
								refreshToken: JSON.parse(storedRefreshToken),
							},
							{ headers: { Accept: "application/json" } },
						);

						const { accessToken, refreshToken } = response.data;

						// Actualizar estado de React
						setTokenState(accessToken);
						setRefreshTokenState(refreshToken);

						// Persistir en localStorage
						localStorage.setItem("accessToken", JSON.stringify(accessToken));
						localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

						// Procesar peticiones encoladas
						processQueue(null, accessToken);

						// Reintentar la petición original con el nuevo token
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return axiosInstance(originalRequest);
					} catch (refreshError) {
						// Si falla el refresh, hacer logout
						processQueue(refreshError, null);
						logout();
						return Promise.reject(refreshError);
					} finally {
						isRefreshing.current = false;
					}
				}

				return Promise.reject(error);
			},
		);

		// Cleanup: remover interceptores al desmontar
		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [logout, processQueue]);

	// Cargar datos de autenticación al montar el componente
	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const storedToken = localStorage.getItem("accessToken");
				const storedRefreshToken = localStorage.getItem("refreshToken");
				const storedProfile = localStorage.getItem("userProfile");

				if (storedToken) setTokenState(JSON.parse(storedToken));
				if (storedRefreshToken) {
					setRefreshTokenState(JSON.parse(storedRefreshToken));
				}
				if (storedProfile) setUserProfile(JSON.parse(storedProfile));
			} catch (error) {
				console.error("Error al cargar los datos de autenticación:", error);
				enqueueSnackbar(
					"Error al cargar los datos de autenticación desde el almacenamiento local",
					{
						variant: "error",
					},
				);
			} finally {
				setLoading(false);
			}
		};

		loadAuthData();
	}, [enqueueSnackbar]);

	// Función para establecer el token
	const setToken = async (newToken: string) => {
		try {
			setTokenState(newToken);
			localStorage.setItem("accessToken", JSON.stringify(newToken));
		} catch (error) {
			console.error("Error al guardar el token:", error);
			enqueueSnackbar("Error al guardar el token", {
				variant: "error",
			});
		}
	};

	// Función para establecer el refresh token
	const setRefreshToken = async (newToken: string) => {
		try {
			setRefreshTokenState(newToken);
			localStorage.setItem("refreshToken", JSON.stringify(newToken));
		} catch (error) {
			console.error("Error al guardar el refresh token:", error);
			enqueueSnackbar("Error al guardar el refresh token", {
				variant: "error",
			});
		}
	};

	// Función para establecer el perfil de usuario
	const setProfile = async (profile: User) => {
		try {
			setUserProfile(profile);
			const jsonValue = JSON.stringify(profile);
			localStorage.setItem("userProfile", jsonValue);
		} catch (error) {
			console.error("Error al guardar el perfil del usuario:", error);
			enqueueSnackbar("Error al guardar el perfil del usuario", {
				variant: "error",
			});
		}
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				refreshToken,
				userProfile,
				loading,
				setToken,
				setRefreshToken,
				setProfile,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Hook para usar el contexto
export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
	}
	return context;
};
