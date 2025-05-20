import React, { useState } from "react";

export default function useToken() {
	const getToken = () => {
		const userToken = JSON.parse(localStorage.getItem("userToken"));
		if (!userToken) return null;
		const parsedToken = parseJwt(userToken);
		// Verificar si el token ha expirado
		if (parsedToken && parsedToken.exp * 1000 < Date.now()) {
			localStorage.removeItem("userToken"); // Elimina el token si ha expirado
			localStorage.removeItem("userProfile"); // Elimina el perfil de usuario
			return null;
		}
		return userToken;
	};

	const [token, setToken] = useState(getToken());

	const saveToken = (userToken) => {
		setToken(userToken);
		localStorage.setItem("userToken", JSON.stringify(userToken));
	};
	return { token, setToken: saveToken };
}

const parseJwt = (token) => {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		return JSON.parse(window.atob(base64));
	} catch (e) {
		return null;
	}
};
