import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
	TextField,
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	Stack,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";

import MDButton from "components/MDButton";
import useFetch from "hooks/useFetch";
import { useAuthContext } from "context/AuthContext";
import type { DirectorForm } from "pages/directors/interfaces/director.interface";
import type { Users } from "pages/users/interfaces/user.interface";
import usePost from "hooks/usePost";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

interface AutocompleteOption {
	label: string;
	ci: number | null;
	userId: string;
}

export default function FormDirector() {
	const { token } = useAuthContext();
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
	const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
	const [inputValueUser, setInputValueUser] = useState(""); // Input para seleccionar un usuario
	const [inputValuePosition, setInputValuePosition] = useState(""); // Input para seleccionar un cargo
	const { enqueueSnackbar } = useSnackbar();
	const {
		data: users,
		loading,
		error,
	} = useFetch<Users>({
		endpoint: `/user?status=true`,
		token,
	});

	const { post, loading: loadingPost, error: errorPost } = usePost();

	// 2. Opciones para el Autocomplete, con búsqueda por nombre, apellido o CI
	const options: AutocompleteOption[] = useMemo(
		() =>
			users
				? users.users.map((user) => ({
						label: `${user.name} ${user.surname}`,
						ci: user.ci,
						userId: user._id,
				  }))
				: [],
		[users]
	);

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<DirectorForm>({
		defaultValues: {
			userId: "",
			startDate: startDate,
			endDate: endDate,
			positionRole: "",
			description: "",
			order: 0,
		},
	});

	const onSubmit = async (data: DirectorForm) => {
		console.log("Form Data:", data);
		const res = await post(
			"/board-directors",
			{ ...data, order: Number(data.order) },
			token
		);
		if (res) {
			console.log("Director registrado:", res);
			enqueueSnackbar("Director registrado correctamente", {
				variant: "success",
			});
			reset(); // Resetea el formulario después de enviar
		}
		if (errorPost) {
			console.error("Error al registrar el director:", errorPost);
			enqueueSnackbar("Error al registrar el director", {
				variant: "error",
			});
		}
	};

	const positions = [
		{
			label: "Presidente",
			userId: "presidente",
		},
		{
			label: "Vice Presidente",
			userId: "vice presidente",
		},
		{
			label: "Actas",
			userId: "actas",
		},
		{
			label: "Hacienda",
			userId: "hacienda",
		},
		{
			label: "Deportes",
			userId: "deportes",
		},
		{
			label: "Agua Potable",
			userId: "agua_potable",
		},
		{
			label: "Secretaria",
			userId: "secretaria",
		},
		{
			label: "Vocal 1",
			userId: "vocal_1",
		},
		{
			label: "Vocal 2",
			userId: "vocal_2",
		},
	];

	return (
		<Card>
			<MDBox
				variant="gradient"
				bgColor="primary"
				borderRadius="lg"
				coloredShadow="success"
				mx={2}
				mt={-3}
				p={3}
				mb={1}
				textAlign="center"
			>
				<MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
					Registrar un nuevo director
				</MDTypography>
			</MDBox>
			<CardContent sx={{ pt: 1, px: 2 }}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={2}>
						{/* User ID Autocomplete Mejorado */}
						<Grid item xs={12}>
							<Controller
								name="userId"
								control={control}
								rules={{ required: "El usuario es obligatorio" }}
								render={({ field, fieldState: { error } }) => (
									<Autocomplete
										options={options}
										getOptionLabel={(option) => option.label}
										isOptionEqualToValue={(option, value) =>
											option.userId === value.userId
										}
										value={
											options.find((opt) => opt.userId === field.value) || null
										}
										onChange={(_, newValue) => {
											field.onChange(newValue ? newValue.userId : "");
										}}
										inputValue={inputValueUser}
										onInputChange={(_, newInputValue) =>
											setInputValueUser(newInputValue)
										}
										loading={loading}
										renderOption={(props, option) => (
											<Box component="li" {...props}>
												{option.label} CI: {option.ci}
											</Box>
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												label="Seleccione un usuario"
												inputProps={{
													...params.inputProps,
													autoComplete: "new-password",
												}}
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
								rules={{ required: "El cargo es obligatorio" }}
								render={({ field, fieldState: { error } }) => (
									<Autocomplete
										options={positions}
										getOptionLabel={(option) => option.label}
										isOptionEqualToValue={(position, value) =>
											position.userId === value.userId
										}
										value={
											positions.find((opt) => opt.userId === field.value) ||
											null
										}
										onChange={(_, newValue) => {
											field.onChange(newValue ? newValue.label : "");
										}}
										inputValue={inputValuePosition}
										onInputChange={(_, newInputValue) =>
											setInputValuePosition(newInputValue)
										}
										loading={loading}
										renderOption={(props, position) => (
											<Box component="li" {...props}>
												{position.label}
											</Box>
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												label="Seleccione un cargo de la lista"
												inputProps={{
													...params.inputProps,
													autoComplete: "new-password",
												}}
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
							/>
						</Grid>

						{/* End Date */}
						<Grid item xs={12} sm={6}>
							<DatePicker
								label="Fecha de finalización"
								value={endDate}
								onChange={(newValue) => setEndDate(newValue)}
								format="DD/MM/YYYY"
							/>
						</Grid>

						{/* Orden en la mesa directiva */}
						<Grid item xs={12}>
							<Controller
								name="order"
								control={control}
								defaultValue={0}
								rules={{ required: "El orden es obligatorio" }}
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										fullWidth
										label="Orden en la mesa directiva"
										type="number"
										error={!!error}
										helperText={error?.message}
									/>
								)}
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
							<Stack direction={"row"} spacing={2} width="100%">
								<MDButton
									variant="contained"
									color="primary"
									fullWidth
									disabled={isSubmitting || loadingPost}
									type="submit"
								>
									{isSubmitting || loadingPost ? "Enviando..." : "Registrar"}
								</MDButton>
								<MDButton
									variant="outlined"
									color="secondary"
									fullWidth
									onClick={() => reset()}
								>
									Resetear
								</MDButton>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
}
