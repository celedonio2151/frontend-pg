import { AxiosError } from "axios";

export default function handlerErrors(err: AxiosError): string {
    // Si el error es por timeout
    if (err.code === "ECONNABORTED") {
        return "La solicitud tardó demasiado en responder. Intenta nuevamente.";
    }

    // Si el error es por una solicitud incorrecta
    if (err.code === "ERR_BAD_REQUEST" && err.response?.data?.message) {
        return err.response.data.message;
    }

    // Si el error es por problemas de red
    if (err.code === "ERR_NETWORK") {
        return "Error de conexión. Por favor, verifica tu conexión a internet.";
    }

    // Si el error tiene una respuesta del servidor
    if (err.response) {
        const { status, data } = err.response;

        // Manejo de códigos de estado HTTP
        switch (status) {
            case 400:
                return data.message || "Solicitud incorrecta.";
            case 401:
                return "No autorizado. Por favor, inicia sesión.";
            case 403:
                return "Acceso denegado.";
            case 404:
                return "Recurso no encontrado.";
            case 500:
                return "Error interno del servidor. Intenta nuevamente más tarde.";
            default:
                return data.message || "Ocurrió un error inesperado.";
        }
    }

    // Si no hay respuesta del servidor
    return "Ocurrió un error inesperado. Por favor, intenta nuevamente.";
}
