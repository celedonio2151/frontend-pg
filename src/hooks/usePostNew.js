import { useState } from "react";
import axios from "axios";
import axiosInstance from "hooks/axiosConfig";

export default function usePostNew(endpoint, body = null, token = null) {

	return new Promise(async (resolve, reject) => {
		try {
			const response = await axiosInstance.post(`${endpoint}`, body, {
				headers: { Authorization: `Bearer ${token}` },
			});
			resolve(response.data);
		} catch (err) {
			reject(err);
		}
	});
}
