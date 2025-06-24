import { useState } from "react";
import { AxiosError } from "axios";
import axiosInstance from "hooks/axiosConfig";
import handlerErrors from "helpers/handlerErrors";

export default function useDelete<T = any, E = any>() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null); // Error procesado como string

	const del = async (endpoint: string, token?: string): Promise<T | null> => {
		setLoading(true);
		setError(null);
		try {
			const response = await axiosInstance.delete<T>(endpoint, {
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});

			// Opcional: Simular delay solo en modo desarrollo
			if (process.env.NODE_ENV === "development") {
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}

			return response.data;
		} catch (err) {
			const axiosError = err as AxiosError<E>;
			const errorMessage = handlerErrors(axiosError); // Procesar el error
			setError(errorMessage);
			throw new Error(errorMessage); // Lanzar el error procesado
		} finally {
			setLoading(false);
		}
	};

	return { del, loading, error };
}
