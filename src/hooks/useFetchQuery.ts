import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "hooks/axiosConfig";

type FetchApi<T> = {
    data: T | undefined;
    error: AxiosError | null;
    isLoading: boolean;
    refetch: () => void;
};

type Props = {
    endpoint: string;
    token?: string;
    queryKey?: string[];
    options?: Omit<UseQueryOptions<any, AxiosError, any, any>, "queryKey" | "queryFn">;
};

export default function useFetchQuery<T>({ endpoint, token, queryKey, options }: Props): FetchApi<T> {
    const { data, error, isLoading, refetch } = useQuery<T, AxiosError>({
        queryKey: queryKey || [endpoint],
        queryFn: async () => {
            const response = await axiosInstance.get(endpoint, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            return response.data;
        },
        ...options,
    });

    return { data, error, isLoading, refetch };
}
