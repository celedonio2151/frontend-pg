import { Box, Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import MDButton from "components/MDButton";
import { useAuthContext } from "context/AuthContext";
import usePost from "hooks/usePost";
import type { Billing } from "pages/billing/interfaces/billing.inerface";

export default function BillingForm({ setTrigger }) {
	const { token } = useAuthContext();
	const { post, loading, error } = usePost<Billing>();
	const { enqueueSnackbar } = useSnackbar();
	const {
		control,
		handleSubmit,
		reset,
		register,
		formState: { errors },
	} = useForm({
		// resolver: yupResolver(validationSchema),
		defaultValues: {
			min_cubic_meters: "",
			max_cubic_meters: "",
			base_rate: "",
			rate: "",
			description: "",
		},
	});
	const onSubmit = async (data: any) => {
		const body = {
			min_cubic_meters: parseInt(data.min_cubic_meters),
			max_cubic_meters: parseInt(data.max_cubic_meters),
			base_rate: parseInt(data.base_rate),
			rate: parseInt(data.rate),
			description: data.description,
		};
		try {
			const res = await post("/billing", body, token);
			if (res) {
				reset(); // Limpiar el formulario después de enviar
				setTrigger(new Date()); // Actualizar el estado para refrescar la tabla
				enqueueSnackbar("Tarifa agregada con éxito", { variant: "success" });
			}
			console.log("Formulario enviado con éxito:", res);
		} catch (err) {
			console.error("Error al enviar el formulario:", error);
			if (error) {
				const errorMessage = error.message || "Error al enviar el formulario.";
				console.error(errorMessage);
				enqueueSnackbar(errorMessage, { variant: "error" });
			}
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				padding: 2, // Espaciado interno
				margin: "0 auto", // Centrar el formulario
			}}
		>
			<Grid container spacing={2}>
				{/* Min M³ */}
				<Grid item xs={12} sm={6}>
					<TextField
						{...register("min_cubic_meters", {
							required: "Este campo es obligatorio.",
						})}
						label="Mínimo (m³)"
						type="number"
						fullWidth
						error={!!errors.min_cubic_meters}
						helperText={errors.min_cubic_meters?.message}
					/>
				</Grid>

				{/* Max M³ */}
				<Grid item xs={12} sm={6}>
					<TextField
						{...register("max_cubic_meters", {
							required: "Este campo es obligatorio.",
						})}
						label="Máximo (m³)"
						type="number"
						fullWidth
						error={!!errors.max_cubic_meters}
						helperText={errors.max_cubic_meters?.message}
					/>
				</Grid>

				{/* Base Rate */}
				<Grid item xs={12} sm={6}>
					<TextField
						{...register("base_rate", {
							required: "Este campo es obligatorio.",
						})}
						label="Tarifa Base (Bs)"
						type="number"
						fullWidth
						error={!!errors.base_rate}
						helperText={errors.base_rate?.message}
					/>
				</Grid>

				{/* Rate */}
				<Grid item xs={12} sm={6}>
					<TextField
						{...register("rate", {
							required: "Este campo es obligatorio.",
						})}
						label="Incremento (Bs)"
						type="number"
						fullWidth
						error={!!errors.rate}
						helperText={errors.rate?.message}
					/>
				</Grid>

				{/* Descripción */}
				<Grid item xs={12}>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Descripción"
								fullWidth
								multiline
								rows={2} // Ajustar la altura del textarea
								size="small"
								error={!!errors.description}
								helperText={errors.description?.message}
							/>
						)}
					/>
				</Grid>

				{/* Botón Agregar */}
				<Grid item xs={12}>
					<MDButton type="submit" fullWidth color="info" variant="gradient">
						Agregar
					</MDButton>
				</Grid>
			</Grid>
		</Box>
	);
}
