import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
	Card,
	Radio,
	RadioGroup,
	FormControl,
	FormControlLabel,
	FormLabel,
	TextField,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import useFetch from "hooks/useFetch";
import MDTypography from "components/MDTypography";
import handlerErrors from "helpers/handlerErrors";
import { useForm, Controller } from "react-hook-form";
import MDButton from "components/MDButton";
import { useParams } from "react-router-dom";
import usePatchNew from "hooks/usePatchNew";
import { useAuthContext } from "context/AuthContext";

export default function EditMeter() {
	const { meterId } = useParams();
	const { token } = useAuthContext();
	const [meter, loadingMeter, errorMeter] = useFetch(
		`/meter/id/${meterId}`,
		null,
		token
	);
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			ci: "",
			fullname: "",
			meterNumber: "",
			status: false,
		},
	});

	const [loadingSubmit, setLoadingSubmit] = useState(false);

	useEffect(() => {
		if (meter) {
			reset({
				ci: meter.ci || "",
				fullname: meter.fullname || "",
				meterNumber: meter.meterNumber || "",
				status: meter.status || false,
			});
		}
	}, [meter, reset]);

	const onSubmit = (data) => {
		setLoadingSubmit(true);
		usePatchNew(`/meter/${meterId}`, data, token)
			.then((response) => {
				alert("Actualizado correctamente!");
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoadingSubmit(false);
			});
	};

	return (
		<DashboardLayout>
			<DashboardNavbar />
			<MDBox py={3}>
				<Grid container spacing={2} justifyContent={"center"}>
					<Grid item xs={12} md={8}>
						<Card sx={{ p: 2 }}>
							<MDTypography sx={{ mt: 1, mb: 1 }} variant="h4">
								Editar Medidor
							</MDTypography>
							<MDBox
								component="form"
								noValidate
								autoComplete="off"
								onSubmit={handleSubmit(onSubmit)}
							>
								{/* Input for CI */}
								<FormControl fullWidth margin="normal">
									<Controller
										name="ci"
										control={control}
										disabled
										rules={{
											required: "El CI es requerido",
											pattern: {
												value: /^[0-9]+$/,
												message: "El CI debe ser un número",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="CI"
												type="number"
												error={!!errors.ci}
												helperText={errors.ci?.message}
											/>
										)}
									/>
								</FormControl>

								{/* Input for Fullname */}
								<FormControl fullWidth margin="normal">
									<Controller
										name="fullname"
										control={control}
										disabled
										rules={{
											required: "El nombre completo es requerido",
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Nombre Completo"
												error={!!errors.fullname}
												helperText={errors.fullname?.message}
											/>
										)}
									/>
								</FormControl>

								{/* Input for Meter Number */}
								<FormControl fullWidth margin="normal">
									<Controller
										name="meterNumber"
										control={control}
										disabled
										rules={{
											required: "El número de medidor es requerido",
											pattern: {
												value: /^[0-9]+$/,
												message: "El número de medidor debe ser un número",
											},
										}}
										render={({ field }) => (
											<TextField
												{...field}
												label="Número de Medidor"
												type="number"
												error={!!errors.meterNumber}
												helperText={errors.meterNumber?.message}
											/>
										)}
									/>
								</FormControl>

								{/* Input for Status (radio buttons) */}
								<FormControl fullWidth margin="normal">
									<FormLabel component="legend">Estado</FormLabel>
									<Controller
										name="status"
										control={control}
										render={({ field }) => (
											<RadioGroup
												{...field}
												row
												value={field.value}
												onChange={(e) =>
													field.onChange(e.target.value === "true")
												}
											>
												<FormControlLabel
													value={true}
													control={<Radio />}
													label="Activo"
												/>
												<FormControlLabel
													value={false}
													control={<Radio />}
													label="Inactivo"
												/>
											</RadioGroup>
										)}
									/>
								</FormControl>

								{/* Submit Button */}
								<MDButton
									fullWidth
									size="large"
									type="submit"
									color="primary"
									disabled={loadingSubmit}
									sx={{ mt: 1.5, mb: 3 }}
								>
									{loadingSubmit ? "Enviando..." : "Guardar Cambios"}
								</MDButton>
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
			<Footer />
		</DashboardLayout>
	);
}
