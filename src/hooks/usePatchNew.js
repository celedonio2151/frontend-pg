import axios from "axios";
import axiosInstance from "hooks/axiosConfig";

export default function usePatchNew(endpoint, body = null, token = undefined) {
	return new Promise(async (resolve, reject) => {
		// Handle cancel request
		try {
			const response = await axiosInstance.patch(`${endpoint}`, body, {
				headers: { Authorization: `Bearer ${token}` },
			});
			resolve(response.data);
		} catch (err) {
			reject(err);
		}
	});
}
