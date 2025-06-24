import {
	useState,
	type Dispatch,
	type SetStateAction,
	useCallback,
} from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Box,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import handlerErrors from "helpers/handlerErrors";
import useDelete from "hooks/useDelete";
import MDButton from "components/MDButton";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import usePatch from "hooks/usePatch";
import type { Billing } from "pages/billing/interfaces/billing.inerface";

type BillingTableProps = {
	dataTable: Billing[];
	setTrigger: Dispatch<SetStateAction<Date>>;
};

export default function BillingTable({
	dataTable,
	setTrigger,
}: BillingTableProps) {
	const { token } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState(dataTable);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [tempData, setTempData] = useState<Billing | null>(null); // Form temporal
	const { patch, loading, error } = usePatch<Billing>();

	// Nuevos estados para manejar la eliminación confirmada
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteRowId, setDeleteRowId] = useState<string | null>(null);

	const handleEdit = useCallback((row: Billing) => {
		setEditingRowId(row._id);
		setTempData({ ...row });
	}, []);

	const handleCancelEdit = useCallback(() => {
		setEditingRowId(null);
		setTempData(null);
	}, []);

	const handleSave = useCallback(async () => {
		if (tempData) {
			const { _id, ...body } = tempData;
			setLoadingSubmit(true);
			try {
				const res = await patch(`/billing/${_id}`, body, token);
				if (res) {
					enqueueSnackbar("Cambios guardados", { variant: "success" });
					setTrigger(new Date());
					setEditingRowId(null);
					setTempData(null);
				}
			} catch (err) {
				enqueueSnackbar(handlerErrors(err || error), { variant: "error" });
			} finally {
				setLoadingSubmit(false);
			}
		}
	}, [tempData, patch, token, setTrigger, enqueueSnackbar, error]);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				await useDelete(`/billing/${id}`, token);
				enqueueSnackbar("Registro eliminado", { variant: "success" });
				setTrigger(new Date());
			} catch (err) {
				enqueueSnackbar(handlerErrors(err), { variant: "error" });
			} finally {
				setOpenDeleteDialog(false);
			}
		},
		[token, setTrigger, enqueueSnackbar]
	);

	const handleChange = useCallback(
		(field: keyof Billing, value: string | number) => {
			if (tempData) {
				if (field === "min_cubic_meters" && value > tempData.max_cubic_meters) {
					enqueueSnackbar("El mínimo no puede ser mayor que el máximo", {
						variant: "error",
					});
					return;
				}
				setTempData({ ...tempData, [field]: value });
			}
		},
		[tempData, enqueueSnackbar]
	);

	const openDeleteConfirmation = useCallback((id: string) => {
		setDeleteRowId(id);
		setOpenDeleteDialog(true);
	}, []);

	const closeDeleteConfirmation = useCallback(() => {
		setDeleteRowId(null);
		setOpenDeleteDialog(false);
	}, []);

	return (
		<TableContainer component={Box} mt={2}>
			<Table>
				<thead>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold" }} width={20}>
							Nº
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={200}>
							Minimo m³
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={200}>
							Saldo Base
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={200}>
							Maximo m³
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={200}>
							Incremento
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={400}>
							Descripción
						</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} width={150}>
							Acciones
						</TableCell>
					</TableRow>
				</thead>
				<TableBody>
					{data.map((row, index) => (
						<TableRow key={row._id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<TextField
										size="medium"
										value={tempData?.min_cubic_meters || ""}
										onChange={(e) =>
											handleChange("min_cubic_meters", +e.target.value)
										}
									/>
								) : (
									row.min_cubic_meters + " m³"
								)}
							</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<TextField
										size="medium"
										value={tempData?.base_rate || ""}
										onChange={(e) => handleChange("base_rate", +e.target.value)}
									/>
								) : (
									row.base_rate + " Bs"
								)}
							</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<TextField
										size="medium"
										value={tempData?.max_cubic_meters || ""}
										onChange={(e) =>
											handleChange("max_cubic_meters", +e.target.value)
										}
									/>
								) : (
									row.max_cubic_meters + " m³"
								)}
							</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<TextField
										size="medium"
										value={tempData?.rate || ""}
										onChange={(e) => handleChange("rate", +e.target.value)}
									/>
								) : (
									row.rate + " Bs"
								)}
							</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<TextField
										size="medium"
										fullWidth
										value={tempData?.description || ""}
										onChange={(e) =>
											handleChange("description", e.target.value)
										}
									/>
								) : (
									row.description
								)}
							</TableCell>
							<TableCell>
								{editingRowId === row._id ? (
									<>
										<IconButton
											onClick={handleSave}
											disabled={loadingSubmit}
											color="success"
											aria-label="Guardar cambios"
										>
											<Save />
										</IconButton>
										<IconButton
											onClick={handleCancelEdit}
											color="secondary"
											aria-label="Cancelar edición"
										>
											<Cancel />
										</IconButton>
									</>
								) : (
									<>
										<IconButton
											onClick={() => handleEdit(row)}
											color="info"
											aria-label="Editar registro"
										>
											<Edit />
										</IconButton>
										<IconButton
											onClick={() => openDeleteConfirmation(row._id)}
											color="error"
											aria-label="Eliminar registro"
										>
											<Delete />
										</IconButton>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Modal de confirmación de eliminación */}
			<Dialog
				open={openDeleteDialog}
				onClose={closeDeleteConfirmation}
				aria-labelledby="confirm-delete-dialog"
			>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>
					¿Estás seguro de que deseas eliminar este registro?
				</DialogContent>
				<DialogActions sx={{ justifyContent: "space-between" }}>
					<MDButton
						onClick={closeDeleteConfirmation}
						color="info"
						variant="text"
					>
						Cancelar
					</MDButton>

					<MDButton
						varint="gradient"
						onClick={() => {
							handleDelete(deleteRowId!);
						}}
						color="error"
					>
						Eliminar
					</MDButton>
				</DialogActions>
			</Dialog>
		</TableContainer>
	);
}
