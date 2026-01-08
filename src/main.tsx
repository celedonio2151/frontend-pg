import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { MaterialUIControllerProvider } from "./context/index.jsx";
import { AuthProvider } from "context/AuthContext";
import "dayjs/locale/es"; // 👉 Importa el locale español
import dayjs from "dayjs";
import router from "routes/router.tsx";
dayjs.locale("es"); // 👉 Aplica español como idioma global

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SnackbarProvider maxSnack={3} autoHideDuration={4000}>
				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
					<AuthProvider>
						<MaterialUIControllerProvider>
							<RouterProvider router={router} />
						</MaterialUIControllerProvider>
					</AuthProvider>
				</LocalizationProvider>
			</SnackbarProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
