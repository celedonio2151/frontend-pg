import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useSnackbar } from "notistack";

import type { User } from "interfaces/Profile.interface";
import eventBus from "helpers/eventBus";

// Definir las propiedades del contexto
interface AuthContextProps {
	token: string | undefined;
	refreshToken: string | undefined;
	userProfile: User | undefined;
	loading: boolean; // <--- Añadido
	setToken: (token: string) => Promise<void>;
	setRefreshToken: (token: string) => Promise<void>;
	setProfile: (profile: User) => Promise<void>;
	logout: () => Promise<void>;
}

// Crear un contexto con un valor inicial nulo
const AuthContext = createContext<AuthContextProps | null>(null);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setTokenState] = useState<string | undefined>(undefined);
	const [refreshToken, setRefreshTokenState] = useState<string | undefined>(
		undefined
	);
	// Estado para el perfil de usuario
	// Se inicializa como undefined para indicar que no hay un perfil cargado
	const [userProfile, setUserProfile] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState(true); // <--- Añadido
	const { enqueueSnackbar } = useSnackbar();

	// Cargar el token y el perfil al montar el componente
	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const storedToken = localStorage.getItem("token");
				const storedRefreshToken = localStorage.getItem("refreshToken");
				const storedProfile = await localStorage.getItem("userProfile");

				if (storedToken) setTokenState(JSON.parse(storedToken));
				if (storedRefreshToken) {
					setRefreshTokenState(JSON.parse(storedRefreshToken));
				}
				// Si el perfil de usuario está en formato JSON, lo parseamos
				if (storedProfile) setUserProfile(JSON.parse(storedProfile));
			} catch (error) {
				console.error("Error al cargar los datos de autenticación:", error);
				enqueueSnackbar(
					"Error al cargar los datos de autenticación desde el almacenamiento local",
					{
						variant: "error",
					}
				);
			} finally {
				setLoading(false); // <--- Finaliza la carga
			}
		};

		const handleTokenRefresh = (data: { token: string }) => {
			if (data?.token) {
				setTokenState(data.token);
			}
		};

		loadAuthData();

		eventBus.on("tokenRefreshed", handleTokenRefresh);

		return () => {
			eventBus.remove("tokenRefreshed", handleTokenRefresh);
		};
	}, []);

	// Función para establecer el token
	const setToken = async (newToken: string) => {
		try {
			setTokenState(newToken);
			await localStorage.setItem("token", JSON.stringify(newToken));
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
			await localStorage.setItem("refreshToken", JSON.stringify(newToken));
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
			await localStorage.setItem("userProfile", jsonValue);
		} catch (error) {
			console.error("Error al guardar el perfil del usuario:", error);
			enqueueSnackbar("Error al guardar el perfil del usuario", {
				variant: "error",
			});
		}
	};

	// Función para cerrar sesión
	const logout = async () => {
		try {
			setTokenState(undefined);
			setRefreshTokenState(undefined);
			setUserProfile(undefined);
			localStorage.removeItem("token"); // localStorage es síncrono, no necesita await
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("userProfile");
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
			enqueueSnackbar("Error al cerrar sesión", {
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
				loading, // <--- Añadido
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
