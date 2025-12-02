import {
	Card,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Switch,
	FormControlLabel,
	Grid,
	Box,
	Autocomplete,
	TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

// MUI ICONS
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
import type { User } from "pages/users/interfaces/user.interface";
type Props = {
	meter: WaterMeter;
	users: User[];
	token: string;
};

export default function EditMeterForm({ meter, users, token }: Props) {
	const { patch, loading, error } = usePatch();
	const { enqueueSnackbar } = useSnackbar();
	const {
		control,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<MeterForm>({
		defaultValues: {
			user_id: meter.user._id,
			status: meter.status,
		},
	});

	const onSubmit = async (data: MeterForm) => {
		console.log("Enviando al servidor ", data);
		try {
			const response = await patch(`/meter/${meter._id}`, data, token);
			if (response) {
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
			<MDBox pt={4} pb={2} px={2}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} role="form">
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-phone-number">
									Usuario Actual
								</InputLabel>
								<OutlinedInput
									id="outlined-email-number"
									disabled
									value={
										meter.user.name +
										" " +
										meter.user.surname +
										" - CI: " +
										meter.meter_number
									}
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle email" edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Usuario Actual"
								/>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Controller
								name="user_id"
								control={control}
								rules={{ required: "El usuario es obligatorio" }}
								render={({ field }) => {
									const selectedUser =
										users.find((u) => u._id === field.value) || null;
									return (
										<Autocomplete
											options={users}
											getOptionLabel={(option) =>
												`${option.name} ${option.surname} - CI: ${option.ci}`
											}
											isOptionEqualToValue={(option, value) =>
												option._id === value?._id
											}
											value={selectedUser}
											onChange={(_, data) => field.onChange(data?._id ?? "")}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Cambiar de Usuario"
													variant="outlined"
													error={!!errors.user_id}
													helperText={errors.user_id?.message}
												/>
											)}
										/>
									);
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-phone-number">
									N° Medidor
								</InputLabel>
								<OutlinedInput
									id="outlined-email-number"
									disabled
									value={meter.meter_number}
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle email" edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="N° Medidor"
								/>
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
				</Box>
			</MDBox>
		</Card>
	);
}
