import {
	Card,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Switch,
	FormControlLabel,
	Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

// MUI ICONS
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PhoneForwardedRoundedIcon from "@mui/icons-material/PhoneForwardedRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

import MDBox from "components/MDBox";
import type {
	MeterForm,
	WaterMeter,
} from "pages/meters/interfaces/meter.interface";
import MDTypography from "components/MDTypography";
import usePatch from "hooks/usePatch";
import { useSnackbar } from "notistack";
import MDButton from "components/MDButton";
type Props = {
	meter: WaterMeter;
	token: string;
};

export default function EditMeterForm({ meter, token }: Props) {
	const { patch, loading, error } = usePatch();
	const { enqueueSnackbar } = useSnackbar();
	const {
		control,
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<MeterForm>({
		defaultValues: {
			ci: meter.ci,
			name: meter.name,
			surname: meter.surname,
			meter_number: meter.meter_number,
			status: meter.status,
		},
	});

	const onSubmit = async (data: MeterForm) => {
		console.log("Enviando al servidor ", data);
		try {
			const response = await patch(`/meter/${meter._id}`, data, token);
			if (response) {
				console.log(response);
				enqueueSnackbar({
					variant: "success",
					message: "Actualizado correctamente",
				});
			}
		} catch (err) {
			if (error) {
				console.log(error);
				enqueueSnackbar({ variant: "error", message: "Ocurrio un error" });
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
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl fullWidth variant="outlined" error={!!errors.ci}>
								<InputLabel htmlFor="outlined-adornment-ci">CI</InputLabel>
								<OutlinedInput
									{...register("ci", {
										required: "El CI es obligatorio",
										pattern: {
											value: /^[0-9]+$/,
											message: "El CI debe ser numérico",
										},
										minLength: {
											value: 5,
											message: "El CI debe tener al menos 5 dígitos",
										},
										maxLength: {
											value: 10,
											message: "El CI debe tener como máximo 10 dígitos",
										},
									})}
									id="outlined-adornment-ci"
									disabled
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle ci" edge="end">
												<ContactEmergencyRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="CI"
								/>
								<FormHelperText>{errors.ci?.message}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth variant="outlined" error={!!errors.name}>
								<InputLabel htmlFor="outlined-adornment-name">
									Nombre
								</InputLabel>
								<OutlinedInput
									{...register("name", {
										required: "El nombre es obligatorio",
									})}
									id="outlined-adornment-name"
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle name" edge="end">
												<AccountCircleRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Nombre"
								/>
								<FormHelperText>{errors.name?.message}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl
								fullWidth
								variant="outlined"
								error={!!errors.surname}
							>
								<InputLabel htmlFor="outlined-adornment-surname">
									Apellido
								</InputLabel>
								<OutlinedInput
									{...register("surname", {
										required: "El apellido es obligatorio",
									})}
									id="outlined-adornment-surname"
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle surname" edge="end">
												<AccountCircleRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Apellido"
								/>
								<FormHelperText>{errors.surname?.message}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl
								fullWidth
								variant="outlined"
								error={!!errors.meter_number}
							>
								<InputLabel htmlFor="outlined-adornment-meter-number">
									N° Medidor
								</InputLabel>
								<OutlinedInput
									{...register("meter_number", {
										required: "El número de medidor es obligatorio",
									})}
									id="outlined-adornment-meter-number"
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle meter number" edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="N° Medidor"
								/>
								<FormHelperText>{errors.meter_number?.message}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Controller
								name="status"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={
											<Switch
												{...field}
												checked={!!field.value}
												color="primary"
											/>
										}
										label={field.value ? "Activo" : "Inactivo"}
									/>
								)}
							/>
						</Grid>
					</Grid>
					<MDBox mt={3} textAlign="center">
						<MDButton
							type="submit"
							fullWidth
							color="primary"
							disabled={isSubmitting || loading}
						>
							{isSubmitting ? "Guardando..." : "Editar Medidor"}
						</MDButton>
					</MDBox>
				</MDBox>
			</MDBox>
		</Card>
	);
}
