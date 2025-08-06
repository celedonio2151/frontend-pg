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

// react-router-dom components
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import {
	Box,
	Card,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
	Typography,
} from "@mui/material";
// Icons from Material UI
import { Visibility, VisibilityOff } from "@mui/icons-material";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import VpnKeyOffRoundedIcon from "@mui/icons-material/VpnKeyOffRounded";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useSnackbar } from "notistack";
import usePost from "hooks/usePost";
import { useForm } from "react-hook-form";
import paths from "routes/paths";
import { useAuthContext } from "context/AuthContext";
import type { UserLogin } from "interfaces/Profile.interface";

interface CreateUserForm {
	ci: number;
	name: string;
	surname: string;
	email?: string;
	password: string;
	confirmPassword: string;
	phoneNumber: string;
	meter_number?: number;
	codeAdmin: string;
}

export default function Cover() {
	const { enqueueSnackbar } = useSnackbar();
	const [showPassword, setShowPassword] = useState(false);
	const [showCodeAdmin, setShowCodeAdmin] = useState(false);
	const { post, loading, error } = usePost<UserLogin>();
	const { setToken, setRefreshToken, setProfile } = useAuthContext();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<CreateUserForm>({
		mode: "onChange", // Validación en tiempo real
	});

	// Expresión regular para contraseña fuerte
	const strongPasswordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':",.<>/?\\|`~]).{6,50}$/;

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const signInWithGoogle = () => {
		console.log("Sign in with google");
		window.open(`${""}/auth/google`, "_self");
	};

	const handleMouseDownPassword = (event: any) => {
		event.preventDefault();
	};

	const onSubmit = async (data: CreateUserForm) => {
		console.log("🚀 ~ onSubmit ~ data:", data);
		try {
			// Convertimos los datos a FormData para enviar como multipart/form-data
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, value as string | Blob);
				}
			});
			formData.append(
				"role_id",
				JSON.stringify(["dbe7a39d-47bf-4fbc-964c-5f477530c5ff"])
			); // Ejemplo de roles

			const res = await post("/auth/admin/signup", formData);
			if (res) {
				setToken(res.myTokens.accessToken);
				setRefreshToken(res.myTokens.refreshToken);
				setProfile(res.user);
				enqueueSnackbar("Usuario registrado exitosamente", {
					variant: "success",
				});
				navigate(paths.users);
			}
		} catch (err) {
			if (error) {
				console.error("Error al registrar usuario:", error);
				enqueueSnackbar("Error al registrar usuario", { variant: "error" });
			}
		}
	};

	return (
		<CoverLayout image={bgImage}>
			<Card sx={{ marginBottom: 3 }}>
				<MDBox
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="success"
					mx={2}
					mt={-3}
					p={3}
					mb={1}
					textAlign="center"
				>
					<Typography
						variant="h4"
						fontWeight="medium"
						color="light.main"
						mt={1}
					>
						Agua Potable Mosoj Llajta
					</Typography>
					<Grid item xs={12}>
						<IconButton
							aria-label="google-sign-in"
							color="light"
							size="medium"
							onClick={() => signInWithGoogle()}
						>
							<GoogleIcon />
						</IconButton>
					</Grid>
				</MDBox>
				<Box pt={4} pb={3} px={2}>
					<Box component="form" onSubmit={handleSubmit(onSubmit)} role="form">
						<Box mb={2}>
							<TextField
								type="number"
								label="Carnet identidad"
								{...register("ci", {
									required: "El CI es obligatorio",
									min: {
										value: 100000,
										message: "Debe tener al menos 6 dígitos",
									},
									max: {
										value: 9999999999,
										message: "No puede tener más de 10 dígitos",
									},
								})}
								error={!!errors.ci}
								helperText={errors.ci?.message}
								fullWidth
							/>
						</Box>
						<Box mb={2}>
							<TextField
								type="text"
								label="Nombres"
								{...register("name", {
									required: "El nombre es obligatorio",
									minLength: {
										value: 2,
										message: "Debe tener al menos 2 caracteres",
									},
									maxLength: {
										value: 50,
										message: "No puede tener más de 50 caracteres",
									},
								})}
								error={!!errors.name}
								helperText={errors.name?.message}
								fullWidth
							/>
						</Box>
						<Box mb={2}>
							<TextField
								type="text"
								label="Apellidos"
								{...register("surname", {
									required: "El apellido es obligatorio",
									minLength: {
										value: 2,
										message: "Debe tener al menos 2 caracteres",
									},
									maxLength: {
										value: 150,
										message: "No puede tener más de 150 caracteres",
									},
								})}
								error={!!errors.surname}
								helperText={errors.surname?.message}
								fullWidth
							/>
						</Box>
						<Box mb={2}>
							<TextField
								type="email"
								label="Gmail"
								{...register("email", {
									required: "El correo electrónico es obligatorio",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Correo electrónico inválido",
									},
								})}
								error={!!errors.email}
								helperText={errors.email?.message}
								fullWidth
							/>
						</Box>
						{/* <MDBox mb={2}>
							<MDInput
								type="number"
								label="Número de medidor"
								name="meter_number"
								// required
								fullWidth
							/>
						</MDBox> */}
						<Box mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password">
									Contraseña
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									type={showPassword ? "text" : "password"}
									{...register("password", {
										required: "La contraseña es obligatoria",
										minLength: {
											value: 6,
											message: "Debe tener al menos 6 caracteres",
										},
										maxLength: {
											value: 50,
											message: "No puede tener más de 50 caracteres",
										},
										pattern: {
											value: strongPasswordRegex,
											message:
												"La contraseña debe tener mayúsculas, minúsculas, números y símbolos",
										},
									})}
									error={!!errors.password}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Password"
								/>
							</FormControl>
							<Typography variant="caption" color="error">
								{errors.password?.message}
							</Typography>
						</Box>
						<Box mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password-repeat">
									Repita la contraseña
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password-repeat"
									type={showPassword ? "text" : "password"}
									{...register("confirmPassword", {
										required: "La repetición de la contraseña es obligatoria",
										validate: (value) =>
											value === watch("password") ||
											"Las contraseñas no coinciden",
									})}
									error={!!errors.confirmPassword}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Repita la contraseña"
								/>
							</FormControl>
							<Typography variant="caption" color="error">
								{errors.confirmPassword?.message}
							</Typography>
						</Box>
						<Box
							mb={2}
							sx={{ display: "flex", justifyContent: "space-between" }}
						>
							<FormControl fullWidth variant="outlined" sx={{ width: "45%" }}>
								<InputLabel htmlFor="outlined-adornment-code-admin">
									Cod. admin
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-code-admin"
									type={showCodeAdmin ? "text" : "password"}
									{...register("codeAdmin", {
										required: "El código de administrador es obligatorio",
									})}
									error={!!errors.codeAdmin}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={() => setShowCodeAdmin(!showCodeAdmin)}
												edge="end"
											>
												{showCodeAdmin ? (
													<VpnKeyOffRoundedIcon />
												) : (
													<VpnKeyRoundedIcon />
												)}
											</IconButton>
										</InputAdornment>
									}
									label="Cod. admin"
								/>
							</FormControl>
							<TextField
								sx={{ width: "50%" }}
								type="number"
								label="Número de celular"
								{...register("phoneNumber", {
									required: "El número de celular es obligatorio",
									min: {
										value: 100000,
										message: "Debe tener al menos 6 dígitos",
									},
									max: {
										value: 999999999999,
										message: "No puede tener más de 12 dígitos",
									},
								})}
								error={!!errors.phoneNumber}
								helperText={errors.phoneNumber?.message}
								fullWidth
							/>
						</Box>
						<Box mt={3} mb={1}>
							<MDButton
								type="submit"
								variant="gradient"
								color="info"
								size="large"
								disabled={loading}
								fullWidth
							>
								Registrar usuario
							</MDButton>
						</Box>
						<Box mt={2} mb={1} textAlign="center">
							<MDTypography variant="button" color="text">
								Ya tienes una cuenta?{" "}
								<MDTypography
									component={Link}
									to={paths.signin}
									variant="button"
									color="info"
									fontWeight="medium"
									textGradient
								>
									Iniciar sessión
								</MDTypography>
							</MDTypography>
						</Box>
					</Box>
				</Box>
			</Card>
		</CoverLayout>
	);
}

// Manejar error si el servidor no responde
