import { useEffect } from "react";
// MUI Components
import {
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
	CircularProgress,
	Card,
	Grid,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";

// MUI ICONS
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";

// Local components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import usePatch from "hooks/usePatch";
import type {
	Reading,
	ReadingForm,
} from "pages/readings/interfaces/meterReading.interface";
import MDTypography from "components/MDTypography";
import useFetch from "hooks/useFetch";
import { useSnackbar } from "notistack";

type Props = {
	reading: Reading;
	token: string;
};

export default function EditReadingForm({ reading, token }: Props) {
	const beforeMonthValue = reading.beforeMonth.value;
	const { enqueueSnackbar } = useSnackbar();
	const { patch, loading, error } = usePatch<Reading>();
	const {
		control,
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { isSubmitting, errors },
	} = useForm<ReadingForm>({
		defaultValues: {
			water_meterId: reading.waterMeter._id,
			beforeMonth: reading.beforeMonth,
			lastMonth: reading.lastMonth.value,
			balance: reading.balance,
			date: reading.date,
			cubicMeters: reading.cubicMeters,
			description: reading.description || "",
		},
	});

	const lastMonth = watch("lastMonth");
	const cubicMeters = Math.max(Number(lastMonth) - Number(beforeMonthValue), 0);
	const balanceEndpoint = `/billing/calculate-balance/${cubicMeters}`;

	const { data: balanceData, loading: balanceLoading } = useFetch<number>({
		endpoint: balanceEndpoint,
		token,
	});

	useEffect(() => {
		if (typeof balanceData === "number") {
			setValue("balance", balanceData);
		}
	}, [balanceData, setValue]);

	const onSubmit = async (data: ReadingForm) => {
		console.log("Enviar al servidor: ", data);
		try {
			const res = await patch(`reading/${reading._id}`, data, token);
			if (res) {
				enqueueSnackbar("Lectura editada correctamente", {
					variant: "success",
				});
			}
		} catch (err) {
			console.error("Error al enviar los datos:", err);
			if (error) {
				enqueueSnackbar("Error al editar la lectura", { variant: "error" });
			}
		}
	};

	return (
		<Card sx={{ marginBottom: 3 }}>
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
					Editando Medidor de agua
				</MDTypography>
			</MDBox>
			<MDBox pt={4} pb={3} px={3}>
				<MDBox component="form" onSubmit={handleSubmit(onSubmit)} role="form">
					{/* Fecha de lectura */}
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								disabled
								fullWidth
								value={dayjs(reading.beforeMonth.date).format("DD MMMM YYYY")}
								label="Lectura anterior"
								placeholder="Lectura anterior del medidor"
								error={!!errors.beforeMonth?.date}
								helperText={errors.beforeMonth?.date?.message}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								disabled
								fullWidth
								value={reading.beforeMonth.value}
								label="Lectura anterior"
								placeholder="Lectura anterior del medidor"
								error={!!errors.beforeMonth?.value}
								helperText={errors.beforeMonth?.value?.message}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									// <DemoItem label="Fecha de lectura actual">
									<DemoItem label="">
										<MobileDateTimePicker
											{...field}
											value={dayjs(field.value)}
											onChange={field.onChange}
											format="DD MMMM YYYY	HH:mm"
										/>
									</DemoItem>
								)}
								rules={{ required: "La fecha es obligatoria" }}
							/>
						</Grid>
						{/* Lectura Actual */}
						<Grid item xs={12}>
							<FormControl
								fullWidth
								variant="outlined"
								error={!!errors.lastMonth}
							>
								<InputLabel htmlFor="outlined-adornment-lastMonth">
									Lectura Actual
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-lastMonth"
									type="number"
									{...register("lastMonth", {
										required: "La lectura es obligatoria",
										validate: (value) =>
											Number(value) >= Number(beforeMonthValue) ||
											"La lectura actual no puede ser menor que la anterior",
									})}
									endAdornment={
										<InputAdornment position="end">
											<IconButton edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Lectura Actual"
								/>
								<FormHelperText>{errors.lastMonth?.message}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-cubicMeters">
									Metros cúbicos m³
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-cubicMeters"
									type="number"
									disabled
									value={cubicMeters}
									endAdornment={
										<InputAdornment position="end">
											<WaterDropRoundedIcon fontSize="medium" />
										</InputAdornment>
									}
									label="Metros cúbicos m³"
								/>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl
								fullWidth
								variant="outlined"
								error={!!errors.balance}
							>
								<InputLabel htmlFor="outlined-adornment-balance">
									Saldo en Bs.
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-balance"
									type="number"
									disabled
									{...register("balance")}
									endAdornment={
										<InputAdornment position="end">
											{balanceLoading ? (
												<CircularProgress size={20} />
											) : (
												<IconButton edge="end">
													<PaidRoundedIcon />
												</IconButton>
											)}
										</InputAdornment>
									}
									label="Saldo en Bs."
								/>
								<FormHelperText>{errors.balance?.message}</FormHelperText>
							</FormControl>
						</Grid>
						{/* Descripción */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								variant="outlined"
								id="description"
								label="Descripción por alterar el precio"
								placeholder="Descripción por alterar el precio u otros"
								{...register("description")}
								rows={2}
							/>
						</Grid>
						<Grid item xs={12}>
							<MDButton
								variant="gradient"
								color="primary"
								type="submit"
								disabled={isSubmitting}
								size="large"
								fullWidth
							>
								{isSubmitting ? "Guardando ..." : "Editar Lectura"}
							</MDButton>
						</Grid>
					</Grid>
				</MDBox>
			</MDBox>
		</Card>
	);
}
