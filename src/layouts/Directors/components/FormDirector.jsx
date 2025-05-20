import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, Card, CardContent, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MDButton from "components/MDButton";
import dayjs from "dayjs";
import useFetch from "hooks/useFetch";
import { useAuthContext } from "context/AuthContext";

export default function FormDirector() {
	const [startDate, setStartDate] = useState(dayjs());
	const [endDate, setEndDate] = useState(dayjs());
	const { token } = useAuthContext();
	const [users, loadingUsers, errorUsers] = useFetch(`/user`, null, token);
	console.log("🚀 ~ FormDirector ~ users:", users);

	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			userId: "",
			startDate: startDate,
			endDate: endDate,
			positionRole: "",
			description: "",
		},
	});

	const onSubmit = (data) => {
		console.log("Form Data:", data);
		// Aquí puedes manejar el envío al backend (fetch/axios)
	};

	const userIds = [
		"Usuario 1",
		"Usuario 2",
		"Usuario 3",
		"Usuario 4",
		"Usuario 5",
	];

	const positions = [
		"Presidente",
		"Vice Presidente",
		"Actas",
		"Hacienda",
		"Deportes",
		"Agua Potable",
		"Secretaria",
		"Vocal 1",
		"Vocal 2",
	];

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" align="center" gutterBottom>
					Formulario de Directorio
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={3}>
						{/* User ID Autocomplete */}
						<Grid item xs={12}>
							<Controller
								name="userId"
								control={control}
								rules={{ required: "El ID del usuario es requerido" }}
								render={({ field, fieldState: { error } }) => (
									<Autocomplete
										{...field}
										options={userIds}
										onChange={(_, data) => field.onChange(data)}
										renderInput={(params) => (
											<TextField
												{...params}
												label="ID del Usuario"
												fullWidth
												error={!!error}
												helperText={error?.message}
											/>
										)}
									/>
								)}
							/>
						</Grid>

						{/* Position Role Autocomplete */}
						<Grid item xs={12}>
							<Controller
								name="positionRole"
								control={control}
								rules={{ required: "El rol es obligatorio" }}
								render={({ field, fieldState: { error } }) => (
									<Autocomplete
										{...field}
										options={positions}
										onChange={(_, data) => field.onChange(data)}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Rol del Cargo"
												fullWidth
												error={!!error}
												helperText={error?.message}
											/>
										)}
									/>
								)}
							/>
						</Grid>

						{/* Start Date */}
						<Grid item xs={12} sm={6}>
							<DatePicker
								label="Fecha de inicio"
								value={startDate}
								onChange={(newValue) => setStartDate(newValue)}
								format="DD/MM/YYYY"
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</Grid>

						{/* End Date */}
						<Grid item xs={12} sm={6}>
							<DatePicker
								label="Fecha de finalización"
								value={endDate}
								onChange={(newValue) => setEndDate(newValue)}
								format="DD/MM/YYYY"
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</Grid>

						{/* Description */}
						<Grid item xs={12}>
							<Controller
								name="description"
								control={control}
								rules={{ required: "La descripción es obligatoria" }}
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										label="Descripción"
										fullWidth
										multiline
										rows={2}
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
						</Grid>

						{/* Buttons */}
						<Grid item xs={12} display="flex" justifyContent="space-between">
							<MDButton variant="contained" color="primary" type="submit">
								Enviar
							</MDButton>
							<MDButton
								variant="outlined"
								color="secondary"
								onClick={() => reset()}
							>
								Resetear
							</MDButton>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
}
