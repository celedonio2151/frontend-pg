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

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// @mui icons
import GoogleIcon from "@mui/icons-material/Google";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Icons
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
	Box,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Typography,
} from "@mui/material";
import usePost from "hooks/usePost";

import { useAuthContext } from "context/AuthContext";
import type { UserLogin } from "interfaces/Profile.interface";
import { useForm } from "react-hook-form";
import paths from "routes/paths";
import { useSnackbar } from "notistack";

interface LoginAdminDto {
	email: string;
	password: string;
}

function Basic() {
	const [showPassword, setShowPassword] = useState(false);
	const { post, loading, error } = usePost<UserLogin>();
	const { setToken, setProfile, setRefreshToken } = useAuthContext();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginAdminDto>({ defaultValues: { email: "", password: "" } });

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const signInWithGoogle = () => {
		console.log("Iniciar sesión con Google");
		window.open(`${""}/auth/admin/google`, "_self");
	};

	const onSubmit = async (data: LoginAdminDto) => {
		try {
			const response = await post("/auth/admin/signin", data);
			if (response) {
				setProfile(response.user);
				setRefreshToken(response.myTokens.refreshToken);
				setToken(response.myTokens.accessToken);
				enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
				navigate(paths.users);
			}
		} catch (error) {
			enqueueSnackbar("Error al iniciar sesión. Verifica tus credenciales.", {
				variant: "error",
			});
		}
	};

	return (
		<BasicLayout image={bgImage}>
			<Card sx={{ mt: "30%" }}>
				<MDBox
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
					mx={2}
					mt={-3}
					p={2}
					mb={1}
					textAlign="center"
				>
					<Grid
						container
						spacing={3}
						justifyContent="center"
						sx={{ mt: 1, mb: 2 }}
						columns={12}
					>
						{/* <Grid item xs={12}>
							<MDTypography
								component={MuiLink}
								href="#"
								variant="body1"
								color="white"
							>
								ADMINISTRADOR
							</MDTypography>
						</Grid> */}
						<Grid item xs={12}>
							<Typography variant="h4" fontWeight="medium" color="white.main">
								Iniciar sessión
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<IconButton
								aria-label="google-sign-in"
								size="medium"
								color="light"
								onClick={() => signInWithGoogle()}
							>
								<GoogleIcon />
							</IconButton>
						</Grid>
					</Grid>
				</MDBox>
				<Box pt={3} pb={1} px={2}>
					<Box
						component="form"
						// noValidate
						onSubmit={handleSubmit(onSubmit)}
						role="form"
					>
						{/* Email */}
						<Box mb={2}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-email">
									Email
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-email"
									type="text"
									{...register("email", {
										required: "El email es obligatorio",
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
											message: "Correo electrónico inválido",
										},
									})}
									error={!!errors.email}
									endAdornment={
										<InputAdornment position="end">
											<IconButton edge="end">
												<EmailRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Email"
								/>
							</FormControl>
							<Typography variant="caption" color="error">
								{errors.email?.message}
							</Typography>
						</Box>

						{/* Contraseña */}
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
									})}
									error={!!errors.password}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Contraseña"
								/>
							</FormControl>
							<Typography variant="caption" color="error">
								{errors.password?.message}
							</Typography>
						</Box>

						{/* Botón de envío */}
						<Box mt={4} mb={1}>
							<MDButton
								variant="gradient"
								type="submit"
								color="info"
								fullWidth
								size="large"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Cargando..." : "Iniciar sesión"}
							</MDButton>
						</Box>

						{/* Enlace para crear cuenta */}
						<Box mt={1} mb={1} textAlign="center">
							<MDTypography variant="button" color="text">
								¿No tienes una cuenta?&nbsp;
								<MDTypography
									component={Link}
									to={paths.signup}
									variant="button"
									color="info"
									fontWeight="medium"
									textGradient
								>
									Crea una cuenta
								</MDTypography>
							</MDTypography>
						</Box>
					</Box>
				</Box>
			</Card>
		</BasicLayout>
	);
}

export default Basic;
