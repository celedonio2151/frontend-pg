import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axiosInstance from "hooks/axiosConfig";

type FetchApi<T> = {
	data: T | null;
	error: AxiosError | null;
	loading: boolean;
	handleCancelRequest?: () => void;
};

type Props = {
	endpoint: string;
	eventTrigger?: any;
	token?: string;
};

export default function useFetch<T>({ ...params }: Props): FetchApi<T> {
	const { endpoint, eventTrigger, token } = params;

	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError | null>(null);
	const [controller, setController] = useState<AbortController>(
		new AbortController()
	);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setData(null);
		const abortController = new AbortController();
		setController(abortController);
		axiosInstance
			.get(`${endpoint}`, {
				headers: { Authorization: `Bearer ${token}` }, // Agrega el token al encabezado si está presente
				// signal: controller.signal,
			})
			.then((response) => {
				// console.log(response.data);
				setData(response.data);
			})
			.catch((err: AxiosError) => {
				// console.log(err.response.data);
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});

		return () => controller.abort();
	}, [endpoint, eventTrigger, token]);

	const handleCancelRequest = () => {
		if (controller) {
			controller.abort();
			// const error = new AxiosError().message('Cance');
			setError(error);
		}
	};

	return { data, loading, error, handleCancelRequest };
}
