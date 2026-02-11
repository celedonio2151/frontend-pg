import { useEffect, useMemo, useState } from "react";
import { Box, Card, Chip } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
// MUI ICONS

import Splash from "components/loader/Splash";
import ErrorLoader from "components/loader/ErrorLoader";
import EmptyLoader from "components/loader/EmptyLoader";
import type { Role, Roles } from "pages/roles/interfaces/role.interface";
import useFetch from "hooks/useFetch";
import MainTable from "examples/Table";
import { useAuthContext } from "context/AuthContext";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import type { ExportHeadersExcel } from "components/XLSX/JsonToExcel";

export default function RolesPage() {
	const { token } = useAuthContext();
	const [exportData, setExportData] = useState<any[]>([]);
	const { data, loading, error } = useFetch<Roles>({
		endpoint: "/role",
		token,
	});

	// Seccion para exportar a excel
	const headers: ExportHeadersExcel[] = [
		{ title: "ID", key: "id", width: 30 },
		{ title: "Nombre", key: "name", width: 30 },
		{ title: "Descripción", key: "description", width: 50 },
		{ title: "Estado", key: "status", width: 20 },
	];
	useEffect(() => {
		if (data) {
			setExportData(() =>
				data.roles.map((item: Role) => ({
					id: item._id,
					name: item.name,
					description: item.description,
					status: item.status ? "Activo " : "Inactivo",
				})),
			);
		}
		return () => {};
	}, [data]);

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
		],
		[],
	);

	return (
		<Box pt={0} pb={3}>
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
					data && (
						<MainTable
							columns={columns}
							data={data.roles}
							exportHeaders={headers}
							exportData={exportData}
							exportFileName="Listado de roles"
						/>
					)
				)}
			</Card>
		</Box>
	);
}
