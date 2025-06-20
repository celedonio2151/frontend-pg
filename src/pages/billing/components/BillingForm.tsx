import { Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import usePostNew from "hooks/usePostNew";
import { useAuthContext } from "context/AuthContext";

export default function BillingForm({ setTrigger }) {
	const { token } = useAuthContext();
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
	const onSubmit = (newRow) => {
		const body = {
			min_cubic_meters: parseInt(newRow.min_cubic_meters),
			max_cubic_meters: parseInt(newRow.max_cubic_meters),
			base_rate: parseInt(newRow.base_rate),
			rate: parseInt(newRow.rate),
			description: newRow.description,
		};
		usePostNew(`/billing`, body, token)
			.then((response) => {
				console.log(response);
				setTrigger(new Date());
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				reset(); // Resetea el formulario
			});
	};

	return (
		<MDBox
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
					<MDButton type="submit" fullWidth color="info">
						Agregar
					</MDButton>
				</Grid>
			</Grid>
		</MDBox>
	);
}
