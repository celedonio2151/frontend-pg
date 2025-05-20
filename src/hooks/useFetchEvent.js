import axios from "axios";
const SERVER = import.meta.env.VITE_SERVER;
// console.log(SERVER);

export default function useFetchEvent(endpoint, token = null) {
	const source = axios.CancelToken.source();
	return new Promise(async (resolve, reject) => {
		try {
			const response = await axios.get(`${SERVER}${endpoint}`, {
				headers: { Authorization: `Bearer ${token}` },
				cancelToken: source.token,
			});
			resolve(response.data);
		} catch (error) {
			if (axios.isCancel(error)) {
				console.log("Request canceled", error.message);
			} else {
				// console.error("Axios error", error);
				reject(handleAxiosError(error));
			}
		}
	});
}

const handleAxiosError = (error) => {
	if (error.response) {
		return error.response.data;
	} else if (error.request) {
		return { message: "No se pudo conectar al servidor" };
	} else {
		return { message: "Ocurrió un error inesperado" };
	}
};
