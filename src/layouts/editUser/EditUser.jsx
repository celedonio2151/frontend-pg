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
import { useContext, useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import {
	Box,
	Chip,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Radio,
	RadioGroup,
	Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// @mui icons
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PhoneForwardedRoundedIcon from "@mui/icons-material/PhoneForwardedRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import InvertColorsOffRoundedIcon from "@mui/icons-material/InvertColorsOffRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import MDButton from "components/MDButton";
import { useNavigate, useParams } from "react-router-dom";
// Custom Hooks
import useFetch from "hooks/useFetch";
import MDScrollDialog from "components/MDDialog";
import MDTableLoading from "components/MDTableLoading/MDTableLoading";
import usePatchNew from "hooks/usePatchNew";
import MDSnackbar from "components/MDSnackbar";
import { formateDate } from "helpers/formatDate";
import handlerErrors from "helpers/handlerErrors";
import { useAuthContext } from "context/AuthContext";

export default function EditUser() {
	const theme = useTheme();
	const { userId } = useParams();
	const { token } = useAuthContext();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false); // Loading button submit
	const [errorUpdate, setErrorUpdate] = useState(null); // Error from server or network request
	const [messageSucces, setMessageSucces] = useState(null); // Message succesfully
	const [valueStatus, setValueStatus] = useState(false); // Check radio MUI
	const [roles, setRoles] = useState([]); // Value Select MUI
	const [openDialog, setOpenDialog] = useState(false);
	const [successSB, setSuccessSB] = useState(false); // Show or Hidden Snackbar Success
	const [errorSB, setErrorSB] = useState(false); // Show or Hidden Snackbar Error

	const [user, loadingUser, error, handleCancel] = useFetch(
		`/user/${userId}`,
		null,
		token
	);
	// console.log("datos del usuario: " + user, loadingUser, error);
	const openSuccessSB = () => setSuccessSB(true); // Show Snackbar Sucess
	const closeSuccessSB = () => setSuccessSB(false); // Close Snackbar Success
	const openErrorSB = () => setErrorSB(true); // Show Snackbar Error
	const closeErrorSB = () => setErrorSB(false); // Close Snackbar Error

	useEffect(() => {
		if (user) {
			setValueStatus(user.status);
			setRoles([user.roles[0]]);
		}
	}, [user]);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};
	const handleChangeStatus = (e) => {
		setValueStatus(e.target.value);
	};
	const renderSuccessSB = (
		<MDSnackbar
			color="success"
			icon={<CheckRoundedIcon color="white" />}
			title="Actualizar usuario"
			content={`${messageSucces}`}
			dateTime={`${formateDate(new Date(), "ddd DD HH:mm:ss")}`}
			open={successSB}
			onClose={closeSuccessSB}
			close={closeSuccessSB}
			// bgWhite
		/>
	);
	const renderErrorSB = (
		<MDSnackbar
			color="error"
			icon={<WarningRoundedIcon color="white" />}
			title="Actualizar usuario"
			content={`${errorUpdate}`}
			dateTime={`${formateDate(new Date(), "ddd DD HH:mm:ss")}`}
			open={errorSB}
			onClose={closeErrorSB}
			close={closeErrorSB}
			// bgWhite
		/>
	);
	const handleChangeSelect = (e) => {
		const {
			target: { value },
		} = e;
		setRoles(typeof value === "string" ? value.split(",") : value);
		// console.log(personName);
	};

	// console.log(user);
	function handleOnSubmitWeter(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const body = {
			water: data.get("meter_number"),
		};
		console.log("registrando usuario", body);
	}

	function handleOnSubmit(e) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// data.append("password", 12345678);
		data.append("birthdate", "2000-01-01");
		data.get("phone_number");
		data.append("roles", roles[0]);
		data.append("status", valueStatus);
		const body = {
			// meter_number: data.get("meter_number"),
			phone_number:
				data.get("phone_number") === "" ? null : data.get("phone_number"),
			roles: data.get("roles"),
			status: JSON.parse(data.get("status")),
		};
		// console.log(body);
		setLoading(true);
		usePatchNew(`/user/${userId}`, body, token)
			.then((response) => {
				openSuccessSB();
				setMessageSucces("Usuario actualizado exitosamente");
				setTimeout(() => {
					navigate(`/users`);
				}, 1500);
			})
			.catch((err) => {
				console.log("🚀  ~ err:", err);
				setErrorUpdate(handlerErrors(err));
				openErrorSB();
			})
			.finally(() => setLoading(false));
	}

	return (
		<DashboardLayout>
			<DashboardNavbar />
			{/* <MDScrollDialog
				open={openDialog}
				setOpen={setOpenDialog}
				title="Registrar un medidor nuevo"
				closeButton={false}
			>
				<MDBox
					component={"form"}
					role="form"
					sx={{ p: 2 }}
					onSubmit={handleOnSubmitWeter}
					noValidate
				>
					<MDBox mb={2}>
						<FormControl fullWidth variant="outlined">
							<InputLabel htmlFor="outlined-meter_number">
								Número del Medidor
							</InputLabel>
							<OutlinedInput
								id="outlined-meter_number"
								type="text"
								name="meter_number"
								defaultValue={user?.meter_number}
								required
								min="9999"
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="toggle ci" edge="end">
											<SpeedRoundedIcon />
										</IconButton>
									</InputAdornment>
								}
								label="Número del Medidor"
							/>
						</FormControl>
					</MDBox>
					<MDBox mt={4} mb={1}>
						<MDButton
							variant="gradient"
							color="warning"
							type="submit"
							disabled={loading}
							size="large"
							fullWidth
						>
							Registrar medidor
						</MDButton>
					</MDBox>
				</MDBox>
			</MDScrollDialog> */}
			<MDBox mb={2} />
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
								bgColor="primary"
								borderRadius="lg"
								coloredShadow="success"
								mx={2}
								mt={-3}
								p={3}
								mb={1}
								textAlign="center"
							>
								<MDTypography
									variant="h4"
									fontWeight="medium"
									color="white"
									mt={1}
								>
									Esta actualizando datos de un usuario
								</MDTypography>
								{/* <MDTypography
									display="block"
									variant="button"
									color="white"
									my={1}
								>
									Un nuevo usuario debe ser aprobado por el comite de agua de
									Mosoj Llajta
								</MDTypography> */}
							</MDBox>
							{user && !loadingUser && (
								<MDBox pt={4} pb={3} px={3}>
									<MDBox
										component="form"
										// noValidate
										onSubmit={handleOnSubmit}
										role="form"
									>
										<MDBox mb={2}>
											<FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-adornment-ci">
													CI
												</InputLabel>
												<OutlinedInput
													id="outlined-adornment-ci"
													type="text"
													name="ci"
													defaultValue={user?.ci}
													required
													disabled
													endAdornment={
														<InputAdornment position="end">
															<IconButton aria-label="toggle ci" edge="end">
																<ContactEmergencyRoundedIcon />
															</IconButton>
														</InputAdornment>
													}
													label="ci"
												/>
											</FormControl>
										</MDBox>
										<MDBox mb={2}>
											<FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-adornment_name">
													Nombre
												</InputLabel>
												<OutlinedInput
													id="outlined-adornment-name"
													type="text"
													name="name"
													defaultValue={user?.name}
													required
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
											</FormControl>
										</MDBox>
										<MDBox mb={2}>
											<FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-surname">
													Apellidos
												</InputLabel>
												<OutlinedInput
													id="outlined-adornment-surname"
													type="text"
													name="surname"
													defaultValue={user?.surname}
													required
													disabled
													endAdornment={
														<InputAdornment position="end">
															<IconButton
																aria-label="toggle surname"
																edge="end"
															>
																<ContactEmergencyRoundedIcon />
															</IconButton>
														</InputAdornment>
													}
													label="Apellido"
												/>
											</FormControl>
										</MDBox>
										<MDBox mb={2}>
											{/* <FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-meter_number">
													Número del Medidor
												</InputLabel>
												<OutlinedInput
													id="outlined-meter_number"
													type="text"
													name="meter_number"
													defaultValue={user?.meter_number}
													required
													min="9999"
													endAdornment={
														<InputAdornment position="end">
															<IconButton aria-label="toggle ci" edge="end">
																<SpeedRoundedIcon />
															</IconButton>
														</InputAdornment>
													}
													label="Número del Medidor"
												/>
											</FormControl> */}
										</MDBox>
										<MDBox mb={2}>
											<FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-meter_number">
													Número de celular
												</InputLabel>
												<OutlinedInput
													id="outlined-meter_number"
													type="text"
													name="phone_number"
													defaultValue={user?.phone_number}
													min="9999"
													endAdornment={
														<InputAdornment position="end">
															<IconButton
																aria-label="toggle phone-number"
																edge="end"
															>
																<PhoneForwardedRoundedIcon />
															</IconButton>
														</InputAdornment>
													}
													label="Numero de celular"
												/>
											</FormControl>
										</MDBox>

										<MDBox mb={2}>
											<FormControl variant="outlined" fullWidth>
												<InputLabel id="demo-multiple-chip-label" sx={{ m: 0 }}>
													Roles
												</InputLabel>
												<Select
													sx={{ padding: 1 }}
													labelId="demo-multiple-chip-label"
													id="demo-multiple-chip"
													// multiple
													value={roles}
													onChange={handleChangeSelect}
													required
													input={
														<OutlinedInput
															id="select-multiple-chip"
															label="Chip"
														/>
													}
													renderValue={(selected) => (
														<Box
															sx={{
																display: "flex",
																flexWrap: "wrap",
																gap: 0.5,
															}}
														>
															{selected.map((value) => (
																<Chip key={value} label={value} />
															))}
														</Box>
													)}
													MenuProps={MenuProps}
												>
													{names.map((name) => (
														<MenuItem
															key={name}
															value={name}
															selected={name === "USER" ? true : false}
															style={getStyles(name, roles, theme)}
														>
															{name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</MDBox>

										<MDBox mb={2}>
											<FormControl fullWidth>
												<FormLabel id="demo-controlled-radio-buttons-group">
													Estado del usuario
												</FormLabel>
												<RadioGroup
													sx={{
														display: "flex",
														justifyContent: "space-between",
														flexDirection: "row",
													}}
													aria-labelledby="demo-controlled-radio-buttons-group"
													name="controlled-radio-buttons-group"
													value={valueStatus}
													onChange={handleChangeStatus}
												>
													<FormControlLabel
														value={true}
														control={<Radio />}
														label="Dar de alta"
													/>
													<FormControlLabel
														value={false}
														control={<Radio />}
														label="Dar de baja"
													/>
												</RadioGroup>
											</FormControl>
										</MDBox>
										{/* <MDBox>
											<MDButton
												onClick={handleOpenDialog}
												color="info"
												fullWidth
											>
												Agregar un nuevo medidor de agua
											</MDButton>
										</MDBox> */}
										<MDBox mt={4} mb={1}>
											<MDButton
												variant="gradient"
												color="primary"
												type="submit"
												disabled={loading}
												size="large"
												fullWidth
											>
												Editar usuario
											</MDButton>
										</MDBox>
									</MDBox>
								</MDBox>
							)}
							{loading && (
								<MDBox p={2}>
									<MDTableLoading title={"Cargando usuario ..."} />
								</MDBox>
							)}
							{error && (
								<MDBox p={2}>
									<MDTypography variant="h3">
										{handlerErrors(error)}
									</MDTypography>
								</MDBox>
							)}
						</Card>
					</Grid>
				</Grid>
			</MDBox>
			{renderSuccessSB}
			{renderErrorSB}
			<Footer />
		</DashboardLayout>
	);
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = ["ADMIN", "USER", "LECTURADOR"];

function getStyles(name, roles, theme) {
	return {
		fontWeight:
			roles.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}
