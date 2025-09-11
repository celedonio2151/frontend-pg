import { useMemo, useState } from "react";
import { Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { useSnackbar } from "notistack";
// MUI ICONS
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import paths from "routes/paths";
import Splash from "components/loader/Splash";
import ErrorLoader from "components/loader/ErrorLoader";
import EmptyLoader from "components/loader/EmptyLoader";
import type { Role, Roles } from "pages/roles/interfaces/role.interface";
import CustomModal from "components/Modal/CustomModal";
import useFetch from "hooks/useFetch";
import MainTable from "examples/Table";
import { useAuthContext } from "context/AuthContext";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import useDelete from "hooks/useDelete";

export default function RolesPage() {
	const { token } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [eventTrigger, setEventTrigger] = useState(new Date());
	const { data, loading, error } = useFetch<Roles>({
		endpoint: "/role",
		eventTrigger,
		token,
	});
	const [open, setOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const {
		del: deleteRequest,
		loading: loadingDelete,
		error: errorDelete,
	} = useDelete();

	const handleEdit = (roleId: any) => {
		console.log("Editar rol:", roleId);
		// Navegar a /pages/role-edit/:id o abrir modal
		navigate(paths.editRole.split(":")[0] + `${roleId}`);
	};

	const handleDelete = () => {
		console.log("Eliminar rol con ID:", selectedId);
		setOpen(false);
		// Hacer DELETE al endpoint /role/:id y refrescar la lista
		deleteRequest(`/role/${selectedId}`)
			.then(() => {
				enqueueSnackbar("Rol eliminado correctamente", {
					variant: "success",
				});
			})
			.catch(() => {
				enqueueSnackbar("Error al eliminar el rol", { variant: "error" });
			})
			.finally(() => {
				setEventTrigger(new Date());
			});
	};

	const openModal = (roleId: string) => {
		setSelectedId(roleId);
		setOpen(true);
	};

	const columns = useMemo<ColumnDef<Role, any>[]>(
		() => [
			{
				accessorKey: "_id",
				header: "Nro",
				cell: (info) => info.row.index + 1,
			},
			{
				accessorKey: "name",
				header: "Nombre",
			},
			{
				accessorKey: "description",
				header: "Descripción",
			},
			{
				accessorKey: "status",
				header: "Estado",
				cell: (info: any) => (
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
				cell: ({ row }: any) => (
					<Stack direction="row" justifyContent={"center"} spacing={1}>
						<IconButton
							size="small"
							onClick={() => handleEdit(row.original._id)}
						>
							<EditRoundedIcon color="info" />
						</IconButton>
						<IconButton
							size="small"
							onClick={() => openModal(row.original._id)}
						>
							<DeleteRoundedIcon color="error" />
						</IconButton>
					</Stack>
				),
			},
		],
		[]
	);

	return (
		<MDBox pt={0} pb={3}>
			<MDButton
				color="info"
				startIcon={<AddRoundedIcon />}
				onClick={() => navigate(paths.createRole)}
			>
				Crear nuevo rol
			</MDButton>
			<Card sx={{ mt: 5, bgcolor: "transparent" }}>
				<MDBox
					mx={2}
					mt={-3}
					mb={3}
					py={3}
					px={2}
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
				>
					<MDTypography variant="h5" color="white">
						Lista de roles del sistema
					</MDTypography>
				</MDBox>

				{loading ? (
					<Splash title="Cargando roles..." />
				) : error ? (
					<ErrorLoader title="Error al cargar los roles" />
				) : data?.roles.length === 0 ? (
					<EmptyLoader title="No hay roles disponibles" />
				) : (
					data && <MainTable columns={columns} data={data.roles} />
				)}
			</Card>

			<CustomModal
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={handleDelete}
				title="Eliminar rol"
				content="¿Estás seguro de que querés eliminar este rol? Esta acción no se puede deshacer."
				confirmText="Sí, eliminar"
				cancelText="Cancelar"
			/>
		</MDBox>
	);
}
