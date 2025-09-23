/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { Box, IconButton, Card, Chip, Stack } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

// Data
// import authorsTableData from "layouts/users/data/authorsTableData";
import { useMemo, useState } from "react";
import CustomTable from "examples/Table";
import MDButton from "components/MDButton";
import MDScrollDialog from "components/MDDialog";
import useFetch from "hooks/useFetch";
import useFetchEvent from "hooks/useFetchEvent";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import { useAuthContext } from "context/AuthContext";
import type {
	WaterMeter,
	WaterMeters,
} from "pages/meters/interfaces/meter.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { formateDate } from "helpers/formatDate";
import { useNavigate } from "react-router-dom";
import paths from "routes/paths";
import EmptyLoader from "components/loader/EmptyLoader";
import ErrorLoader from "components/loader/ErrorLoader";

export default function Meters() {
	const { token } = useAuthContext();
	const navigate = useNavigate();
	const [eventTrigger, setEventTrigger] = useState(new Date());
	const { data, loading, error } = useFetch<WaterMeters>({
		endpoint: `/meter`,
		eventTrigger,
		token,
	});

	const onReload = () => setEventTrigger(new Date());

	function handleOnClickEdit(meterId: string) {
		console.log("Edit ", meterId);
		navigate(paths.editWaterMeter.split(":")[0] + meterId);
	}

	function handleOnClickDelete(getValue) {
		console.log("Delete ", getValue());
	}

	const columns = useMemo<ColumnDef<WaterMeter, any>[]>(
		() => [
			{
				id: "rowNumber",
				header: "Nº",
				cell: (info) => info.row.index + 1,
			},
			{
				accessorKey: "ci",
				header: "Carnet Identidad",
			},
			{
				accessorKey: "name",
				header: "Nombres",
			},
			{
				accessorKey: "surname",
				header: "Apellidos",
			},
			{
				accessorFn: (row) => formateDate(row.createdAt, "DD-MM-YYYY"),
				header: "Fecha registro",
			},
			{
				accessorKey: "status",
				header: "Estado",
				cell: (info) => (
					<Chip
						label={info.getValue() ? "Activo" : "Inactivo"}
						color={info.getValue() ? "success" : "error"}
						size="small"
					/>
				),
			},
			{
				id: "acciones",
				header: "Acciones",
				cell: ({ row }) => (
					<Stack direction="row" justifyContent={"center"} spacing={1}>
						<IconButton
							size="small"
							onClick={() => handleOnClickEdit(row.original._id)}
						>
							<EditRoundedIcon color="info" />
						</IconButton>
						<IconButton
							size="small"
							// onClick={() => openModal(row.original._id)}
						>
							<DeleteIcon color="error" />
						</IconButton>
					</Stack>
				),
			},
		],
		[]
	);

	// console.log(data);

	return (
		<>
			<Box pt={2} pb={3}>
				<Card>
					<MDBox
						mx={2}
						mt={-3}
						py={3}
						px={2}
						variant="gradient"
						bgColor="info"
						borderRadius="lg"
						coloredShadow="info"
					>
						<MDTypography variant="h5" color="white">
							Medidores de Agua Potable Mosoj Llajta
						</MDTypography>
					</MDBox>
					<Box pt={3}>
						{data && data.waterMeters.length === 0 && !loading && (
							<EmptyLoader
								title="No hay medidores registrados"
								description="Aun no hay medidores registrados, registre una"
								reloadLabel="Refrescar pagina"
								onReload={onReload}
							/>
						)}

						{data && data.waterMeters.length > 0 && !loading && (
							<CustomTable data={data.waterMeters} columns={columns} filter />
						)}

						{loading && <MDTableLoading title={"Cargando Usuarios"} rows={5} />}

						{error && (
							<ErrorLoader
								title="Error al cargar medidores"
								description={`${
									error?.message || "Intente refrescar la pagina"
								}`}
							/>
						)}
					</Box>
				</Card>
			</Box>
			{/* DIALOG */}
			{/* <MDScrollDialog
				open={openDiaolog}
				setOpen={setOpenDialog}
				title={`Medidores de ${row?.name} ${row?.surname}`}
				closeButton={false}
			>
				<Box
					sx={{
						// width: "100%",
						maxWidth: 360,
						bgcolor: "background.paper",
					}}
				>
					<List>
						{waterMeters && waterMeters.length > 0 ? (
							waterMeters.map((water, i) => (
								<ListItem
									key={i}
									disablePadding={true}
									secondaryAction={
										<IconButton edge="start" aria-label="status">
											{water.status ? (
												<StatusCircle color={"green"} />
											) : (
												<StatusCircle color={"red"} />
											)}
										</IconButton>
									}
								>
									<ListItemButton>
										<ListItemIcon>
											<SpeedRoundedIcon />
										</ListItemIcon>
										<ListItemText primary={water.meterNumber} />
									</ListItemButton>
								</ListItem>
							))
						) : (
							<ListItem>
								{loadingMeter ? (
									<MDTypography sx={{ p: 2 }} component="h3" variant="p">
										Cargado medidores
									</MDTypography>
								) : (
									<MDTypography sx={{ p: 2 }} component="h3" variant="p">
										No tiene medidores registrados
									</MDTypography>
								)}
							</ListItem>
						)}
					</List>
				</Box>
			</MDScrollDialog> */}
		</>
	);
}
