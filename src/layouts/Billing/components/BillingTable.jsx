import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Button,
	IconButton,
	Paper,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import {
	Edit,
	Delete,
	Save,
	Cancel,
	FormatAlignJustify,
} from "@mui/icons-material";
import usePatchNew from "hooks/usePatchNew";
import handlerErrors from "helpers/handlerErrors";
import useDelete from "hooks/useDelete";
import MDButton from "components/MDButton";
import { useAuthContext } from "context/AuthContext";

export default function BillingTable({ dataTable, setTrigger }) {
	const { token } = useAuthContext();
	const [data, setData] = useState(dataTable);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [editingRowId, setEditingRowId] = useState(null);
	const [tempData, setTempData] = useState(null);

	// Nuevos estados para manejar la eliminación confirmada
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deleteRowId, setDeleteRowId] = useState(null);

	const handleEdit = (row) => {
		setEditingRowId(row._id);
		setTempData({ ...row });
	};

	const handleCancelEdit = () => {
		setEditingRowId(null);
		setTempData(null);
	};

	const handleSave = () => {
		if (tempData) {
			const { _id, createdAt, updatedAt, ...body } = tempData;
			setLoadingSubmit(true);
			usePatchNew(`/billing/${_id}`, body, token)
				.then((response) => {
					console.log(response);
					setTrigger(new Date());
				})
				.catch((err) => {
					console.log(err);
					alert(handlerErrors(err));
				})
				.finally(() => {
					setEditingRowId(null);
					setTempData(null);
					setLoadingSubmit(false);
				});
		}
	};

	const handleDelete = (id) => {
		setTrigger(new Date());
		useDelete(`/billing/${id}`, token)
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setOpenDeleteDialog(false); // Cerrar el diálogo después de la eliminación
			});
	};

	const handleChange = (field, value) => {
		if (tempData) {
			setTempData({ ...tempData, [field]: value });
		}
	};

	const openDeleteConfirmation = (id) => {
		setDeleteRowId(id);
		setOpenDeleteDialog(true);
	};

	const closeDeleteConfirmation = () => {
		setDeleteRowId(null);
		setOpenDeleteDialog(false);
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<thead>
						<TableRow>
							<TableCell width={20}>Nº</TableCell>
							<TableCell width={200}>Minimo m³</TableCell>
							<TableCell width={200}>Saldo Base</TableCell>
							<TableCell width={200}>Maximo m³</TableCell>
							<TableCell width={200}>Incremento</TableCell>
							<TableCell width={400}>Descripción</TableCell>
							<TableCell width={150}>Acciones</TableCell>
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
											onChange={(e) =>
												handleChange("base_rate", +e.target.value)
											}
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
											>
												<Save />
											</IconButton>
											<IconButton onClick={handleCancelEdit} color="secondary">
												<Cancel />
											</IconButton>
										</>
									) : (
										<>
											<IconButton onClick={() => handleEdit(row)} color="info">
												<Edit />
											</IconButton>
											<IconButton
												onClick={() => openDeleteConfirmation(row._id)}
												color="error"
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
			</TableContainer>

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
					<MDButton onClick={closeDeleteConfirmation} color="info">
						Cancelar
					</MDButton>

					<MDButton
						onClick={() => {
							handleDelete(deleteRowId);
						}}
						color="error"
					>
						Eliminar
					</MDButton>
				</DialogActions>
			</Dialog>
		</>
	);
}
