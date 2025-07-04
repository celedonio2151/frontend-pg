import { useEffect, useState, useMemo } from "react";
import {
	Card,
	FormControl,
	InputLabel,
	InputAdornment,
	OutlinedInput,
	TextField,
	Autocomplete,
	IconButton,
	FormHelperText,
	Box,
	Grid,
	CircularProgress,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

// MUI ICONS
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import useFetch from "hooks/useFetch";
import MDButton from "components/MDButton";
import { formateDate } from "helpers/formatDate";
import { useAuthContext } from "context/AuthContext";

import type {
	Reading,
	ReadingForm,
} from "pages/readings/interfaces/meterReading.interface";
import type { WaterMeters } from "pages/meters/interfaces/meter.interface";

export default function CreateReadingPage() {
	const { enqueueSnackbar } = useSnackbar();
	const { token } = useAuthContext();
	const [disabledBalance, setDisabledBalance] = useState(true);

	// 1. Obtener medidores solo una vez
	const { data: meters } = useFetch<WaterMeters>({
		endpoint: `/meter?status=true`,
		eventTrigger: null,
		token,
	});

	// 2. Opciones para el Autocomplete, con búsqueda por nombre, apellido o CI
	const options = useMemo(
		() =>
			meters
				? meters.waterMeters.map((meter) => ({
						label: `${meter.name} ${meter.surname}`,
						ci: meter.ci,
						waterMeterId: meter._id,
				  }))
				: [],
		[meters]
	);

	// 3. Formulario
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<ReadingForm>({
		defaultValues: {
			water_meterId: "",
			date: dayjs(new Date()),
			beforeMonth: { date: new Date(), value: 0 },
			lastMonth: { date: new Date(), value: 0 },
			cubicMeters: 0,
			balance: 0,
			description: "",
		},
	});
	const beforeMonthValue = useWatch({ control, name: "beforeMonth.value" });
	const lastMonth = watch("lastMonth");
	const cubicMeters = Math.max(Number(lastMonth) - Number(beforeMonthValue), 0);
	const balanceEndpoint = `/billing/calculate-balance/${cubicMeters}`;

	// Peticion al servidor para calcular saldo Bs.
	const { data: balanceData, loading: balanceLoading } = useFetch<number>({
		endpoint: balanceEndpoint,
		token,
	});

	// 4. Obtener el medidor seleccionado
	const selectedMeterId = useWatch({ control, name: "water_meterId" });

	// 5. Pedir la última lectura solo cuando cambia el medidor seleccionado
	const { data: reading } = useFetch<Reading>({
		endpoint: selectedMeterId ? `/reading/${selectedMeterId}` : "",
		eventTrigger: selectedMeterId,
		token,
	});
	// Si cambia la lectura, actualizar el valor de cubicMeters
	useEffect(() => {
		if (balanceData && typeof balanceData === "number")
			setValue("balance", balanceData);
		setValue("cubicMeters", cubicMeters);
	}, [balanceData]);

	// 6. Al recibir la última lectura, actualizar beforeMonth y mostrar al usuario
	useEffect(() => {
		if (reading?.lastMonth) {
			setValue("beforeMonth", {
				date: new Date(reading.lastMonth.date),
				value: reading.lastMonth.value,
			});
			// También puedes inicializar la fecha de la nueva lectura aquí si lo deseas
		} else {
			setValue("beforeMonth", { date: new Date(), value: 0 });
		}
	}, [reading, setValue]);

	// 9. Enviar solo el id del medidor
	const onSubmit = async (formData: ReadingForm) => {
		const payload = {
			...formData,
			water_meterId: formData.water_meterId,
		};
		console.log("Peticion al servidor...", payload);
		enqueueSnackbar("Lectura registrada correctamente", { variant: "success" });
	};

	return (
		<Card sx={{ marginBottom: 3, width: 1 }}>
			<MDBox
				variant="gradient"
				bgColor="primary"
				borderRadius="lg"
				coloredShadow="primary"
				mx={2}
				mt={-3}
				p={3}
				mb={1}
				textAlign="center"
			>
				<MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
					Registrando una nueva lectura del medidor
				</MDTypography>
			</MDBox>
			<MDBox pt={4} pb={3} px={3}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} role="form">
					<Grid container spacing={2} mb={2}>
						<Grid item xs={12} sm={12}>
							<Controller
								name="water_meterId"
								control={control}
								rules={{ required: "Seleccione un medidor" }}
								render={({ field }) => (
									<Autocomplete
										{...field}
										options={options}
										getOptionLabel={(option) =>
											typeof option === "string"
												? option
												: `${option.label} (${option.ci})`
										}
										filterOptions={(opts, state) =>
											opts.filter(
												(opt) =>
													opt.label
														.toLowerCase()
														.includes(state.inputValue.toLowerCase()) ||
													String(opt.ci).includes(state.inputValue)
											)
										}
										isOptionEqualToValue={(option, value) =>
											option.waterMeterId === value?.waterMeterId
										}
										value={
											options.find((opt) => opt.waterMeterId === field.value) ||
											null
										}
										onChange={(_, newValue) => {
											field.onChange(newValue ? newValue.waterMeterId : "");
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Buscar usuario por nombre o CI"
												error={!!errors.water_meterId}
												helperText={errors.water_meterId?.message}
											/>
										)}
									/>
								)}
							/>
						</Grid>
						{/* Fecha de lectura anterior*/}
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-before-month">
									Fecha de lectura anterior
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-before-month"
									type="text"
									disabled
									value={
										reading?.lastMonth
											? `${formateDate(reading.lastMonth.date, "DD/MM/YYYY")}`
											: "Sin fecha de lectura anterior"
									}
									endAdornment={
										<InputAdornment position="end">
											<CalendarMonthRoundedIcon
												fontSize="medium"
												color="disabled"
											/>
										</InputAdornment>
									}
									label="Fecha de lectura anterior"
								/>
							</FormControl>
						</Grid>

						{/* Lectura anterior */}
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-before-month">
									Lectura Anterior
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-before-month"
									type="text"
									disabled
									value={
										reading?.lastMonth
											? `${reading.lastMonth.value}`
											: "Sin lectura anterior"
									}
									endAdornment={
										<InputAdornment position="end">
											<SpeedRoundedIcon fontSize="medium" color="disabled" />
										</InputAdornment>
									}
									label="Lectura Anterior"
								/>
							</FormControl>
						</Grid>

						{/* Fecha de lectura actual*/}
						<Grid item xs={12} sm={6}>
							<Controller
								name="date"
								control={control}
								rules={{ required: "La fecha es obligatoria" }}
								render={({ field }) => (
									<MobileDateTimePicker
										{...field}
										label="Fecha de lectura"
										format="DD/MM/YYYY	HH:mm"
										slotProps={{
											textField: {
												error: !!errors.date,
												helperText: errors.date?.message,
												fullWidth: true,
											},
										}}
									/>
								)}
							/>
						</Grid>

						{/* Lectura actual */}
						<Grid item xs={12} sm={6}>
							<Controller
								name="lastMonth"
								control={control}
								rules={{
									required: "La lectura actual es obligatoria",
									min: { value: 0, message: "Debe ser mayor o igual a 0" },
									validate: (value) =>
										value >= beforeMonthValue ||
										"La lectura actual no puede ser menor que la anterior",
								}}
								render={({ field }) => (
									<FormControl
										fullWidth
										variant="outlined"
										error={!!errors.lastMonth}
									>
										<InputLabel htmlFor="outlined-adornment-name">
											Lectura Actual
										</InputLabel>
										<OutlinedInput
											{...field}
											id="outlined-adornment-name"
											type="number"
											label="Lectura Actual"
											endAdornment={
												<InputAdornment position="end">
													<IconButton aria-label="toggle name" edge="end">
														<SpeedRoundedIcon />
													</IconButton>
												</InputAdornment>
											}
										/>
										<FormHelperText>{errors.lastMonth?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>

						{/* Metros cúbicos consumidos */}
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								variant="outlined"
								label="Cubos consumidos m³" // Eleva al cubo
								value={cubicMeters}
								disabled
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<WaterDropRoundedIcon
												color="disabled"
												fontSize="medium"
											/>
										</InputAdornment>
									),
								}}
							/>
						</Grid>

						{/* Saldo */}
						<Grid item xs={12} sm={6}>
							<Controller
								name="balance"
								control={control}
								rules={{
									required: !disabledBalance
										? "El saldo es obligatorio"
										: false,
									min: { value: 1, message: "El saldo debe ser mayor que 0" },
									max: {
										value: 1000,
										message: "El saldo debe ser menor que 1000",
									},
								}}
								render={({ field }) => (
									<FormControl
										fullWidth
										variant="outlined"
										error={!!errors.balance}
									>
										<InputLabel htmlFor="outlined-adornment-balance">
											Saldo en Bs.
										</InputLabel>
										<OutlinedInput
											{...field}
											id="outlined-adornment-balance"
											type="number"
											endAdornment={
												<InputAdornment position="end">
													{balanceLoading ? (
														<CircularProgress size={20} />
													) : (
														<IconButton
															aria-label="toggle name"
															edge="end"
															onClick={() =>
																setDisabledBalance((prev) => !prev)
															}
														>
															<PaidRoundedIcon />
														</IconButton>
													)}
												</InputAdornment>
											}
											disabled={disabledBalance}
											label="Saldo en Bs."
										/>
										<FormHelperText>{errors.balance?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>

						{/* Descripción solo si el saldo es editable */}
						{!disabledBalance && (
							<Grid item xs={12} sm={12}>
								<Controller
									name="description"
									control={control}
									rules={{
										required: "La descripción es obligatoria",
										minLength: {
											value: 5,
											message: "Debe tener al menos 5 caracteres",
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											variant="outlined"
											label="Descripción por alterar el precio"
											multiline
											rows={2}
											error={!!errors.description}
											helperText={errors.description?.message}
										/>
									)}
								/>
							</Grid>
						)}

						<Grid item xs={12} sm={12}>
							<MDButton
								variant="gradient"
								color="primary"
								type="submit"
								size="large"
								fullWidth
								disabled={isSubmitting}
							>
								{isSubmitting ? "Guardando..." : "Registrar lectura"}
							</MDButton>
						</Grid>
					</Grid>
				</Box>
			</MDBox>
		</Card>
	);
}
