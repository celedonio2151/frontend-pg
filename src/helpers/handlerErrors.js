import React from "react";

export default function handlerErrors(err) {
	if (err.code === "ECONNABORTED") return err.message;
	if (err.code === "ERR_BAD_REQUEST") return err.response.data.message;
	if (err.code === "ERR_NETWORK") return err.message;
}
