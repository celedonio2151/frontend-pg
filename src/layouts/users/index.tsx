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
import {
	Box,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItem,
	ListItemText,
	Card,
	Grid,
	Stack,
	Chip,
	Avatar,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

// Data
// import authorsTableData from "layouts/users/data/authorsTableData";
import { useEffect, useMemo, useState } from "react";
import CustomTable from "examples/Table";
import { NavLink } from "react-router-dom";
import MDButton from "components/MDButton";
import MDScrollDialog from "components/MDDialog";
import useFetchEvent from "hooks/useFetchEvent";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import JsonToExcel from "components/XLSX/JsonToExcel";
import useFetch from "hooks/useFetch";
import { useAuthContext } from "context/AuthContext";
import type { User, Users } from "layouts/users/interfaces/user.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { formateDate } from "helpers/formatDate";

export default function ListUsers() {
	const { token } = useAuthContext();
	const [openDiaolog, setOpenDialog] = useState(false);
	const [waterMeters, setWaterMeters] = useState();
	const [loadingMeter, setLoadingMeter] = useState(false);
	const [row, setRow] = useState(null);
	const [jsonToExcel, setJsonToExcel] = useState(null);
	const { data, loading, error } = useFetch<Users>({
		endpoint: `/user`,
		eventTrigger: null,
		token,
	});

	useEffect(() => {
		if (data) {
			// setJsonToExcel(() =>
			// 	data.users.map((item) => ({
			// 		id: item._id,
			// 		name: item.name,
			// 		surname: item.surname,
			// 		ci: item.ci,
			// 		phone_number: item.phone_number,
			// 		roles: item.roles.join(", "),
			// 		status: item.status ? "Activo " : "Inactivo",
			// 	}))
			// );
		}

		return () => {};
	}, [data]);

	// console.log("🚀 ~ ListUsers ~ data:", data);
	const handleClickOpenDialog = (row) => {
		setOpenDialog(true);
		setWaterMeters(null);
		setLoadingMeter(true);
		setRow(row.original);
		useFetchEvent(`/meter/${row.original.ci}`, token)
			.then((response) => {
				setWaterMeters(response);
			})
			.catch((err) => {
				// console.log(err);
			})
			.finally(() => {
				setLoadingMeter(false);
			});
		// console.log("Abriendo dialog", row.original);
	};
	function handleOnClickEdit(getValue) {
		console.log("Edit ", getValue());
	}

	function handleOnClickDelete(getValue) {
		console.log("Delete ", getValue());
	}

	const columns = useMemo<ColumnDef<User, any>[]>(
		() => [
			{
				accessorFn: (row) => row.profileImg,
				header: "Foto",
				cell: (info) => (
					<Avatar
						src={info.getValue()}
						// width={36}
						// height={36}
						sx={{ borderRadius: "50%", objectFit: "cover" }}
					/>
				),
			},
			{
				accessorFn: (row) => `${row.name} ${row.surname}`,
				header: "Nombre completo",
			},
			{
				accessorKey: "ci",
				header: "Carner identidad",
			},
			{
				accessorKey: "email",
				header: "Correo",
			},
			{
				accessorKey: "phoneNumber",
				header: "Teléfono",
			},
			{
				accessorFn: (row) =>
					formateDate(row.birthDate || new Date(), "DD-MM-YYYY"),
				header: "Nacimiento",
			},
			{
				accessorFn: (row) => row.roles.map((r: any) => r.name).join(", "),
				header: "Roles",
				cell: (info) => {
					const roles = info.getValue().split(", ");
					return (
						<Stack direction="row" spacing={1}>
							{roles.map((r: string, idx: number) => (
								<Chip
									key={idx}
									label={r}
									color={r === "ADMIN" ? "primary" : "default"}
									size="small"
								/>
							))}
						</Stack>
					);
				},
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
					<Stack direction="row" spacing={1}>
						<IconButton
							size="small"
							onClick={() => handleOnClickEdit(row.original)}
						>
							<EditNoteRoundedIcon color="info" />
							{/* <IconifyIcon icon={"mdi:account-edit"} color="primary.main" /> */}
						</IconButton>
						<IconButton
							size="small"
							// onClick={() => openModal(row.original._id)}
						>
							<DeleteIcon color="error" />
							{/* <IconifyIcon icon={"mdi:delete"} color={"error.main"} /> */}
						</IconButton>
					</Stack>
				),
			},
		],
		[]
	);

	// console.log(data);
	const headers = [
		{ title: "ID", width: 4 },
		{ title: "NOMBRE", width: 20 },
		{ title: "APELLIDO", width: 30 },
		{ title: "CARNET DE IDENTIDAD", width: 20 },
		{ title: "NUMERO DE CELULAR", width: 20 },
		{ title: "ROLES", width: 20 },
		{ title: "ESTADO", width: 10 },
	];

	return (
		<>
			<MDBox pt={6} pb={3}>
				{/* <Grid container spacing={6}>
					<Grid item xs={12}> */}
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
							Lista de filiados Agua Potable Mosoj Llajta
						</MDTypography>
					</MDBox>
					{data && data.users.length > 0 && (
						<JsonToExcel
							headers={headers}
							data={jsonToExcel}
							// fileName="Productos.xlsx"
							// sheetName="Productos"
							title="Listado de usuarios"
							// additionalInfo="Generado el 30/11/2024 por Admin"
						/>
					)}
					<MDBox pt={3}>
						{data && data.users.length === 0 && !loading && (
							<MDTypography variant="h4" p={2}>
								No hay usuarios registrados
							</MDTypography>
						)}
						{data && data.users.length > 0 && !loading && (
							<CustomTable data={data.users} columns={columns} />
						)}
						{loading && <MDTableLoading title={"Cargando Usuarios"} rows={5} />}
					</MDBox>
				</Card>
				{/* </Grid>
				</Grid> */}
			</MDBox>
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

function StatusCircle({ color }) {
	return (
		<Box
			sx={{
				width: 15,
				height: 15,
				bgcolor: color,
				borderRadius: "50%",
			}}
		/>
	);
}
