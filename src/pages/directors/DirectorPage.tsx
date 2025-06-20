import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import useFetch from "hooks/useFetch";
import MDTypography from "components/MDTypography";
import handlerErrors from "helpers/handlerErrors";
import FormDirector from "pages/directors/components/FormDirector";
import { formateDate } from "helpers/formatDate";
import { useAuthContext } from "context/AuthContext";
import type { Directors } from "pages/directors/interfaces/director.interface";

export default function DirectorPage() {
	const maxRows = 3; // Máximo número de filas para la vista inicial
	const columnsPerRow = 3; // Número de columnas por fila
	const itemsPerPage = maxRows * columnsPerRow;
	const { token } = useAuthContext();
	const { data, loading, error } = useFetch<Directors>({
		endpoint: `/board-directors?status=true`,
		eventTrigger: null,
		token,
	});

	// const boardData = [
	// 	{
	// 		_id: 1,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Presidente",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T16:35:50.725Z",
	// 		updatedAt: "2024-12-05T16:35:50.725Z",
	// 		user: {
	// 			_id: 1,
	// 			ci: 77777711,
	// 			name: "Aneliz",
	// 			surname: "Salgueiro Torrez",
	// 			email: "aneliz@gmail.com",
	// 			phone_number: 77777711,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 2,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Vice Presidente",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T16:35:59.252Z",
	// 		updatedAt: "2024-12-05T16:35:59.252Z",
	// 		user: {
	// 			_id: 2,
	// 			ci: 66666611,
	// 			name: "Maria",
	// 			surname: "Ramos Flores",
	// 			email: "maria@gmail.com",
	// 			phone_number: 66666611,
	// 			profileImg: "1732422534679-Captura_desde_2024-11-21_12-04-46.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 3,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Actas",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:38:17.886Z",
	// 		updatedAt: "2024-12-05T18:38:17.886Z",
	// 		user: {
	// 			_id: 3,
	// 			ci: 66666622,
	// 			name: "Gustavo",
	// 			surname: "Herrera Torrez",
	// 			email: "gustavo@gmail.com",
	// 			phone_number: 66666622,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 4,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Hacienda",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:38:56.483Z",
	// 		updatedAt: "2024-12-05T18:38:56.483Z",
	// 		user: {
	// 			_id: 4,
	// 			ci: 66666633,
	// 			name: "Nelcy",
	// 			surname: "Guzman Lenis",
	// 			email: null,
	// 			phone_number: 66666633,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 5,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Deportes",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:39:06.428Z",
	// 		updatedAt: "2024-12-05T18:39:06.428Z",
	// 		user: {
	// 			_id: 5,
	// 			ci: 66666644,
	// 			name: "Jaime",
	// 			surname: "Cartajena Partes",
	// 			email: "jaime@gmail.com",
	// 			phone_number: 66666644,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 6,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Agua Potable",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:39:23.773Z",
	// 		updatedAt: "2024-12-05T18:39:23.773Z",
	// 		user: {
	// 			_id: 6,
	// 			ci: 66666655,
	// 			name: "Sandra",
	// 			surname: "Martinez Sdenka",
	// 			email: null,
	// 			phone_number: 66666655,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 7,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Secreataria",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:39:38.690Z",
	// 		updatedAt: "2024-12-05T18:39:38.690Z",
	// 		user: {
	// 			_id: 7,
	// 			ci: 66666666,
	// 			name: "Juan Carlos",
	// 			surname: "Bustamante Talavera",
	// 			email: null,
	// 			phone_number: 66666666,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 8,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Vocal 1",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:39:53.735Z",
	// 		updatedAt: "2024-12-05T18:39:53.735Z",
	// 		user: {
	// 			_id: 8,
	// 			ci: 66666677,
	// 			name: "Katherin",
	// 			surname: "Vedia Jimenez",
	// 			email: null,
	// 			phone_number: 66666677,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// 	{
	// 		_id: 9,
	// 		startDate: "2024-02-05T04:20:10.000Z",
	// 		endDate: "2024-12-05T04:20:10.000Z",
	// 		positionRole: "Vocal 2",
	// 		description: "Nada que decir",
	// 		createdAt: "2024-12-05T18:40:03.774Z",
	// 		updatedAt: "2024-12-05T18:40:03.774Z",
	// 		user: {
	// 			_id: 9,
	// 			ci: 66666688,
	// 			name: "Walter",
	// 			surname: "Guevara Arce",
	// 			email: null,
	// 			phone_number: 66666688,
	// 			profileImg: "defaultUser.png",
	// 		},
	// 	},
	// ];

	return (
		<>
			<MDBox py={3}>
				{/* Grid para mostrar los primeros elementos */}
				<Typography variant="h3" textAlign="center" py={2}>
					Mesa directiva {formateDate(new Date(), "YYYY")}{" "}
				</Typography>
				{data && !loading && (
					<Grid container sx={{ justifyContent: "center" }} spacing={3}>
						{data.directors.slice(0, 1).map((item, index) => (
							<Grid key={item._id} item xs={12} md={6} lg={4}>
								<Card>
									<CardContent
										sx={{ display: "flex", justifyContent: "center" }}
									>
										<MDAvatar
											src={item.user.profileImg}
											sx={{ width: 180, height: 180 }}
											shadow="lg"
										/>
									</CardContent>
									<CardContent>
										<Typography variant="h6" align="center">
											{item.positionRole}
										</Typography>
										<Typography
											variant="body1"
											align="center"
											color="text.secondary"
										>
											{`${item.user.name} ${item.user.surname}`}
										</Typography>
										<Typography
											variant="caption"
											align="center"
											display="block"
											mt={1}
										>
											{`Periodo: ${new Date(
												item.startDate
											).toLocaleDateString()} - ${new Date(
												item.endDate
											).toLocaleDateString()}`}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}

				{/* Grid para el resto de los elementos */}
				{data?.directors && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						{data.directors.slice(1).map((item, index) => (
							<Grid key={item._id} item xs={12} md={4} lg={4}>
								<Card>
									<CardContent
										sx={{ display: "flex", justifyContent: "center" }}
									>
										<MDAvatar
											src={item.user.profileImg}
											sx={{ width: 150, height: 150 }}
											shadow="md"
										/>
									</CardContent>
									<CardContent>
										<Typography variant="h6" align="center">
											{item.positionRole}
										</Typography>
										<Typography
											variant="body1"
											align="center"
											color="text.secondary"
										>
											{`${item.user.name} ${item.user.surname}`}
										</Typography>
										<Typography
											variant="caption"
											align="center"
											display="block"
											mt={1}
										>
											{`Periodo: ${new Date(
												item.startDate
											).toLocaleDateString()} - ${new Date(
												item.endDate
											).toLocaleDateString()}`}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
				{loading && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={4} lg={4}>
							<MDTypography variant="h4" align="center" mt={1}>
								Cargando mesa directiva ...
							</MDTypography>
						</Grid>
					</Grid>
				)}
				{error && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={4} lg={4}>
							<MDTypography variant="h4" align="center" mt={1}>
								{handlerErrors(error)}
							</MDTypography>
						</Grid>
					</Grid>
				)}
				{true && (
					<Grid container sx={{ justifyContent: "center", mt: 4 }} spacing={3}>
						<Grid item xs={12} md={6} lg={4}>
							<FormDirector />
						</Grid>
					</Grid>
				)}
			</MDBox>
		</>
	);
}
