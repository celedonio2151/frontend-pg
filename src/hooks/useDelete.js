import axios from "axios";
import axiosInstance from "hooks/axiosConfig";

export default function useDelete(endpoint, token = undefined) {
	return new Promise(async (resolve, reject) => {
		// Handle cancel request
		try {
			const response = await axiosInstance.delete(`${endpoint}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			resolve(response.data);
		} catch (err) {
			reject(err);
		}
	});
}
