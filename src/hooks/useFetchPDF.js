const SERVER = import.meta.env.VITE_SERVER;

export default async function useFetchPDF(endpoint, token, blank) {
	// Ver y descargar en certificado
	const apiUrl = `${SERVER}${endpoint}`;
	const headers = {
		Authorization: `Bearer ${token}`, // Agregar el token como cabecera de autorización
	};
	try {
		// Realizar una solicitud para verificar si el PDF está disponible
		const response = await fetch(apiUrl, { headers });

		if (response.status === 200) {
			// Si la solicitud fue exitosa (status 200), abrir la URL en una nueva ventana
			const blob = await response.blob();
			const pdfURL = URL.createObjectURL(blob);
			window.open(pdfURL, blank, "noopener,noreferrer");
		} else {
			// Manejar el caso en el que la solicitud no sea exitosa
			console.error(
				"Error al obtener el PDF. Estado de respuesta:",
				response.status
			);
		}
	} catch (error) {
		// Manejar errores de red u otras excepciones
		console.error("Error al obtener el PDF:", error);
	}
}
