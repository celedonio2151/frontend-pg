import { AxiosError } from "axios";
import useFetchQuery from "./useFetchQuery";

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

export default function useFetch<T>({ endpoint, token, eventTrigger }: Props): FetchApi<T> {
	// include eventTrigger in the queryKey so React Query refetches when it changes
	const queryKey = eventTrigger !== undefined ? [endpoint, eventTrigger] : [endpoint];

	const { data, isLoading, error } = useFetchQuery<T>({ endpoint, token, queryKey });

	// Adapter to match the original interface
	return {
		data: data || null,
		loading: isLoading,
		error,
		handleCancelRequest: () => {
			// No-op for now as React Query handles cancellation differently
			console.warn("handleCancelRequest is deprecated in favor of React Query's automatic cancellation");
		},
	};
}
