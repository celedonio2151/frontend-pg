/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import {
	Box,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";

// @mui icons
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

import handlerErrors from "helpers/handlerErrors";
import { useAuthContext } from "context/AuthContext";
import { useSnackbar } from "notistack";
import usePost from "hooks/usePost";
import type {
	User,
	UserFormRegister,
} from "pages/users/interfaces/user.interface";
import paths from "routes/paths";

export default function RegisterUserPage() {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { token } = useAuthContext();
	const { post, loading, error } = usePost<User>();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UserFormRegister>({
		defaultValues: {
			ci: undefined,
			name: "",
			surname: "",
			email: "",
			meter_number: undefined,
			phoneNumber: "",
		},
		shouldFocusError: true,
	});

	const onSubmit = async (data: any) => {
		const body = {
			...data,
			password: "Password20xx!", // Hardcoded password
			birthdate: "2000-01-01", // Hardcoded birthdate
		};
		const dataCleaned = cleanBody(body);
		console.log("Peticion al servidor", dataCleaned);
		try {
			const res = await post("/user", dataCleaned, token);
			if (res) {
				enqueueSnackbar("Usuario registrado correctamente", {
					variant: "success",
				});
				navigate(paths.users);
			}
		} catch (err) {
			if (!loading) {
				console.error("Error al registrar usuario:", error);
				const coolError = error?.response?.data.message?.join(", ");
				enqueueSnackbar(coolError || "Error al registrar usuario", {
					variant: "error",
				});
			}
		}
	};
	const cleanBody = (body: UserFormRegister) => {
		const cleanedBody: UserFormRegister = { ...body };
		if (!cleanedBody.email) delete cleanedBody.email;
		if (!cleanedBody.meter_number) delete cleanedBody.meter_number;
		if (!cleanedBody.birthDate) delete cleanedBody.birthDate;
		return cleanedBody;
	};

	return (
		<>
			<MDBox
				width="calc(100% - 2rem)"
				minHeight={"35vh"}
				borderRadius="xl"
				mx={2}
				my={2}
				pt={6}
				pb={28}
				sx={{
					backgroundImage: ({
						functions: { linearGradient, rgba },
						palette: { gradients },
					}) =>
						bgImage &&
						`${linearGradient(
							rgba(gradients.dark.main, 0.4),
							rgba(gradients.dark.state, 0.4)
						)}, url(${bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			/>
			<MDBox
				mt={{ xs: -20, lg: -18 }}
				px={1}
				width="calc(100% - 2rem)"
				mx="auto"
			>
				<Grid container spacing={1} justifyContent="center">
					<Grid item sm={6}>
						<Card sx={{ marginBottom: 3 }}>
							<MDBox
								variant="gradient"
								bgColor="info"
								borderRadius="lg"
								coloredShadow="success"
								mx={2}
								mt={-3}
								p={2}
								mb={1}
								textAlign="center"
							>
								<MDTypography
									variant="h4"
									fontWeight="medium"
									color="white"
									mt={1}
								>
									Registrar nuevo usuario
								</MDTypography>
								<MDTypography
									display="block"
									variant="button"
									color="white"
									my={1}
								>
									Un nuevo usuario debe ser aprobado por el comite de agua de
									Mosoj Llajta
								</MDTypography>
							</MDBox>

							<Box pt={2} pb={1} px={2}>
								<Box
									component="form"
									onSubmit={handleSubmit(onSubmit)}
									noValidate
								>
									{/* Documento de identidad */}
									<Box mb={2}>
										<Controller
											name="ci"
											control={control}
											rules={{
												required: "El CI es requerido",
												minLength: 5,
												maxLength: 12,
											}}
											render={({ field }) => (
												<FormControl fullWidth variant="outlined">
													<InputLabel
														htmlFor="outlined-adornment-ci"
														error={!!errors.ci}
													>
														CI
													</InputLabel>
													<OutlinedInput
														{...field}
														id="outlined-adornment-ci"
														label="CI"
														error={!!errors.ci}
														endAdornment={
															<InputAdornment position="end" tabIndex={-1}>
																<IconButton edge="end" disableRipple>
																	<ContactEmergencyRoundedIcon />
																</IconButton>
															</InputAdornment>
														}
													/>
													{errors.ci && (
														<FormHelperText error>
															{errors.ci.message}
														</FormHelperText>
													)}
												</FormControl>
											)}
										/>
									</Box>
									{/* Nombre de usuario */}
									<Box mb={2}>
										<Controller
											name="name"
											control={control}
											rules={{
												required: "El nombre es requerido",
												minLength: 3,
												maxLength: 30,
												pattern: {
													value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,
													message: "El nombre no debe empezar con numero",
												},
											}}
											render={({ field }) => (
												<FormControl fullWidth variant="outlined">
													<InputLabel
														htmlFor="outlined-adornment-name"
														error={!!errors.name}
													>
														Nombre
													</InputLabel>
													<OutlinedInput
														{...field}
														id="outlined-adornment-name"
														type="text"
														label="Nombre"
														error={!!errors.name}
														endAdornment={
															<InputAdornment position="end" tabIndex={-1}>
																<IconButton edge="end" disableRipple>
																	<AccountCircleRoundedIcon />
																</IconButton>
															</InputAdornment>
														}
													/>
													{errors.name && (
														<FormHelperText error>
															{errors.name.message}
														</FormHelperText>
													)}
												</FormControl>
											)}
										/>
									</Box>
									{/* Apellidos del usuario */}
									<Box mb={2}>
										<Controller
											name="surname"
											control={control}
											rules={{
												required: "El apellido es requerido",
												minLength: 3,
												maxLength: 30,
												pattern: {
													value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/,
													message: "El nombre no debe empezar con numero",
												},
											}}
											render={({ field }) => (
												<FormControl fullWidth variant="outlined">
													<InputLabel
														htmlFor="outlined-adornment-surname"
														error={!!errors.surname}
													>
														Apellidos
													</InputLabel>
													<OutlinedInput
														{...field}
														id="outlined-adornment-surname"
														type="text"
														label="Apellidos"
														required
														error={!!errors.surname}
														endAdornment={
															<InputAdornment position="end">
																<IconButton
																	edge="end"
																	disableRipple
																	tabIndex={-1}
																>
																	<ContactEmergencyRoundedIcon />
																</IconButton>
															</InputAdornment>
														}
													/>
													{errors.surname && (
														<FormHelperText error>
															{errors.surname.message}
														</FormHelperText>
													)}
												</FormControl>
											)}
										/>
									</Box>
									{/* Número de celular */}
									<Box mb={2}>
										<Controller
											name="phoneNumber"
											control={control}
											rules={{
												required: "El celular es requerido",
												minLength: 8,
												maxLength: 10,
												pattern: {
													value: /^[0-9]+$/,
													message:
														"El número de teléfono no debe empezar con letras",
												},
											}}
											render={({ field }) => (
												<TextField
													{...field}
													type="number"
													label="Celular"
													fullWidth
													error={!!errors.phoneNumber?.message}
													helperText={errors.phoneNumber?.message}
													// Como agregar icono?
													InputProps={{
														endAdornment: (
															<InputAdornment position="end" tabIndex={-1}>
																<IconButton disableRipple edge="end">
																	<PhoneEnabledRoundedIcon />
																</IconButton>
															</InputAdornment>
														),
													}}
												/>
											)}
										/>
									</Box>
									{/* Numero de medidor */}
									<Box mb={2}>
										<Controller
											name="meter_number"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													type="number"
													label="Número del Medidor"
													fullWidth
													InputProps={{
														endAdornment: (
															<InputAdornment position="end" tabIndex={-1}>
																<IconButton disableRipple edge="end">
																	<SpeedRoundedIcon />
																</IconButton>
															</InputAdornment>
														),
													}}
												/>
											)}
										/>
									</Box>
									{/* Boton enviar formulario */}
									<Box mt={3} mb={1}>
										<MDButton
											variant="gradient"
											color="info"
											type="submit"
											disabled={isSubmitting}
											size="large"
											fullWidth
										>
											{isSubmitting
												? "Registrando usuario..."
												: "Registrar usuario"}
										</MDButton>
									</Box>
								</Box>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</>
	);
}
