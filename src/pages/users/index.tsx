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
import { Box, IconButton, Card, Stack, Chip, Avatar } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

// Data
// import authorsTableData from "layouts/users/data/authorsTableData";
import { useEffect, useMemo, useState } from "react";
import CustomTable from "examples/Table";
import { NavLink, useNavigate } from "react-router-dom";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import JsonToExcel from "components/XLSX/JsonToExcel";
import useFetch from "hooks/useFetch";
import { useAuthContext } from "context/AuthContext";
import type { User, Users } from "pages/users/interfaces/user.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { formateDate } from "helpers/formatDate";
import CustomModal from "components/Modal/CustomModal";
import paths from "routes/paths";
import EmptyLoader from "components/loader/EmptyLoader";
import ErrorLoader from "components/loader/ErrorLoader";

export default function ListUsers() {
	const { token } = useAuthContext();
	const navigate = useNavigate();
	const [eventTrigger, setEventTrigger] = useState(new Date());
	const [openDiaolog, setOpenDialog] = useState(false);
	const [modal, setModal] = useState(false); // Modal para eliminar
	const [userId, setUserId] = useState("");
	const [jsonToExcel, setJsonToExcel] = useState<any[] | null>(null);
	const { data, loading, error } = useFetch<Users>({
		endpoint: `/user`,
		eventTrigger,
		token,
	});

	useEffect(() => {
		if (data) {
			setJsonToExcel(() =>
				data.users.map((item: User) => ({
					id: item._id,
					name: item.name,
					surname: item.surname,
					ci: item.ci,
					phone_number: item.phoneNumber,
					roles:
						JSON.stringify(item.roles?.map((r: any) => r.name)) || "Sin rol",
					status: item.status ? "Activo " : "Inactivo",
				}))
			);
		}

		return () => {};
	}, [data]);

	const openModal = (userId: string) => {
		setUserId(userId);
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
	};

	const handlerConfirmModal = () => {
		console.log("Modal confirm: Eliminando usuario", userId);
		setModal(false);
	};

	const reload = () => setEventTrigger(new Date());

	function handleOnClickEdit(userId: string) {
		navigate(paths.editUser.split(":")[0] + `${userId}`);
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
						<Stack direction="row" spacing={1} justifyContent={"center"}>
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
					<Stack direction="row" justifyContent={"center"} spacing={1}>
						<IconButton
							size="medium"
							onClick={() => handleOnClickEdit(row.original._id)}
						>
							<EditRoundedIcon color="info" />
						</IconButton>
						{/* <IconButton
							size="medium"
							onClick={() => openModal(row.original._id)}
						>
							<DeleteIcon color="error" />
						</IconButton> */}
					</Stack>
				),
			},
		],
		[]
	);

	// console.log(data);
	const headers = [
		{ title: "ID", width: 8 },
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
					{/* Show button export to excel */}
					{data && data.users.length > 0 && jsonToExcel && (
						<JsonToExcel
							headers={headers}
							data={jsonToExcel}
							// fileName="Productos.xlsx"
							// sheetName="Productos"
							title="Listado de usuarios"
							// additionalInfo="Generado el 30/11/2024 por Admin"
						/>
					)}
					<Box pt={0}>
						{data && data.users.length === 0 && !loading && (
							<EmptyLoader
								title="No hay usuarios registrados"
								description="Lista de usuarios esta vacio"
								onReload={reload}
								reloadLabel="Recargar"
							/>
						)}

						{data && data.users.length > 0 && !loading && (
							<CustomTable data={data.users} columns={columns} filter />
						)}

						{loading && <MDTableLoading title={"Cargando Usuarios"} rows={5} />}

						{error && (
							<ErrorLoader
								title="Error al cargar los usuarios"
								description={"Intente de nuevo mas tarde " + error.message}
							/>
						)}
					</Box>
				</Card>

				{/* MODAL TO DELETE USER */}
				<CustomModal
					title="Eliminar usuario"
					open={modal}
					onClose={closeModal}
					onConfirm={handlerConfirmModal}
					cancelText="Cancelar"
					confirmText="Eliminar"
				/>
			</MDBox>
		</>
	);
}
