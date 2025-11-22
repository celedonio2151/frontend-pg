import {
	Card,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	FormHelperText,
	Switch,
	Select,
	MenuItem,
	Box,
	Divider,
	Grid,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PhoneForwardedRoundedIcon from "@mui/icons-material/PhoneForwardedRounded";

import { useForm } from "react-hook-form";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import usePatch from "hooks/usePatch";
import type { User, UserForm } from "pages/users/interfaces/user.interface";
import type { Role } from "pages/roles/interfaces/role.interface";
import WaterMeters from "pages/users/components/WaterMeters";

type Props = {
	user: User;
	roles: Role[];
	token: string;
};

export default function EditUserForm({ user, roles, token }: Props) {
	const { patch, loading, error } = usePatch();

	const { enqueueSnackbar } = useSnackbar();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<UserForm>({
		defaultValues: {
			name: user.name,
			surname: user.surname,
			ci: user.ci || 0,
			email: user.email || "",
			phoneNumber: user.phoneNumber || "",
			birthDate: user.birthDate || undefined,
			role_id: user.roles?.map((role) => role._id) || [],
			status: user.status,
			meters: user.meters || [],
		},
	});

	const selectedRoles = watch("role_id");
	const isAdminRoleSelected = selectedRoles?.includes(
		roles.find((role) => role.name === "ADMIN")?._id || ""
	);

	const emailRules = {
		required: isAdminRoleSelected
			? "El correo electrónico es obligatorio para el rol de ADMIN"
			: false,
		pattern: {
			value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: "Debe ser un correo electrónico válido",
		},
	};

	const handleMetersChange = (meters: string[]) => {
		setValue("meters", meters);
	};

	const onSubmit = async (data: UserForm) => {
		console.log("🚀 ~ onSubmit ~ data:", data);
		try {
			if (!data.email) delete data.email;
			console.log("🚀 ~ onSubmit ~ data:", data);

			const response = await patch(`/user/${user._id}`, data, token);
			if (response) {
				enqueueSnackbar("Usuario actualizado correctamente", {
					variant: "success",
				});
			}
		} catch (err) {
			console.error("Error al actualizar el usuario", error);
			enqueueSnackbar(
				error?.response?.data.message || "Error al actualizar el usuario",
				{
					variant: "error",
				}
			);
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
					Esta actualizando datos de un usuario
				</MDTypography>
			</MDBox>
			<Box pt={2} pb={1} px={2}>
				<Grid
					container
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					role="form"
					spacing={2}
				>
					<Grid item xs={12} md={6}>
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

					<Grid item xs={12} md={6}>
						<FormControl fullWidth variant="outlined" error={!!errors.name}>
							<InputLabel htmlFor="outlined-adornment-name">Nombre</InputLabel>
							<OutlinedInput
								id="outlined-adornment-name"
								{...register("name", {
									required: "El nombre es obligatorio",
									minLength: {
										value: 3,
										message: "El nombre debe tener al menos 3 caracteres",
									},
								})}
								disabled
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

					<Grid item xs={12} md={6}>
						<FormControl fullWidth variant="outlined" error={!!errors.surname}>
							<InputLabel htmlFor="outlined-adornment-surname">
								Apellidos
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-surname"
								{...register("surname", {
									required: "El apellido es obligatorio",
									minLength: {
										value: 3,
										message: "El apellido debe tener al menos 3 caracteres",
									},
								})}
								disabled
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="toggle surname" edge="end">
											<AccountCircleRoundedIcon />
										</IconButton>
									</InputAdornment>
								}
								label="Apellidos"
							/>
							<FormHelperText>{errors.surname?.message}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={6}>
						<FormControl
							fullWidth
							variant="outlined"
							error={!!errors.phoneNumber}
						>
							<InputLabel htmlFor="outlined-phone-number">
								Número de celular
							</InputLabel>
							<OutlinedInput
								id="outlined-phone-number"
								{...register("phoneNumber", {
									required: "El número de celular es obligatorio",
									pattern: {
										value: /^[0-9]{7,8}$/,
										message: "Debe ser un número válido (7-8 dígitos)",
									},
								})}
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="toggle phone-number" edge="end">
											<PhoneForwardedRoundedIcon />
										</IconButton>
									</InputAdornment>
								}
								label="Número de celular"
							/>
							<FormHelperText>{errors.phoneNumber?.message}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={6}>
						<FormControl
							fullWidth
							variant="outlined"
							required={isAdminRoleSelected}
							error={!!errors.phoneNumber}
						>
							<InputLabel htmlFor="outlined-phone-number">Correo</InputLabel>
							<OutlinedInput
								id="outlined-email-number"
								{...register("email", emailRules)}
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="toggle email" edge="end">
											<PhoneForwardedRoundedIcon />
										</IconButton>
									</InputAdornment>
								}
								label="Correo"
							/>
							<FormHelperText error>{errors.email?.message}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12} md={6}>
						<FormControl fullWidth variant="outlined" error={!!errors.role_id}>
							<InputLabel id="demo-simple-select-label">Roles</InputLabel>
							<Select
								sx={{ p: 1.5 }}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								multiple
								defaultValue={user.roles?.map((role) => role._id)}
								{...register("role_id", {
									required: "El rol es obligatorio",
								})}
								label="Roles"
							>
								{roles.map((role) => (
									<MenuItem key={role._id} value={role._id} sx={{ mb: 0.5 }}>
										{role.name}
									</MenuItem>
								))}
							</Select>

							<FormHelperText>{errors.role_id?.message}</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<FormControl
							fullWidth
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<FormLabel id="estado-usuario-label" sx={{ fontSize: "1rem" }}>
								Estado del usuario
							</FormLabel>
							<FormControlLabel
								control={
									<Switch
										{...register("status")}
										color="primary"
										checked={watch("status")}
									/>
								}
								label={watch("status") ? "Estado activo" : "Estado inactivo"}
							/>
						</FormControl>
						<Divider />
						<WaterMeters
							initialMeters={user.meters}
							onChange={handleMetersChange}
						/>
					</Grid>

					<Grid item xs={12} mb={1}>
						<MDButton
							variant="gradient"
							color="primary"
							type="submit"
							disabled={isSubmitting || loading}
							size="large"
							fullWidth
						>
							{isSubmitting || loading
								? "Actualizando..."
								: "Actualizar usuario"}
						</MDButton>
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
}
