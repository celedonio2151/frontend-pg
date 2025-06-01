import axiosInstance from "hooks/axiosConfig";

export default function AxiosInterceptor() {
	axiosInstance.interceptors.request.use(
		(request) => {
			console.log("Starting Request", request);
			return request;
		},
		(error) => {
			console.error("Request Error", error);
			return Promise.reject(error);
		}
	);
}
