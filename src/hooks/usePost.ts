import { useState } from "react";
import { AxiosError } from "axios";
import axiosInstance from "hooks/axiosConfig";

export default function usePost<T = any, E = any>() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError<E> | null>(null);

	const post = async (
		endpoint: string,
		body?: any,
		token?: string
	): Promise<T | null> => {
		setLoading(true);
		setError(null);
		try {
			const response = await axiosInstance.post<T>(endpoint, body, {
				headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			});

			// Simular delay global de 2s (opcional)
			await new Promise((resolve) => setTimeout(resolve, 2000));

			return response.data;
		} catch (err) {
			const axiosError = err as AxiosError<E>;
			setError(axiosError);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { post, loading, error };
}
