import { useState } from "react";
import {
	Switch,
	IconButton,
	Box,
	Typography,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	FormHelperText,
} from "@mui/material";

// MUI ICONS
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import MDButton from "components/MDButton";
import type { WaterMeter } from "pages/meters/interfaces/meter.interface";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { UserForm } from "pages/users/interfaces/user.interface";

type WaterMetersProps = {
	initialMeters?: WaterMeter[];
	control: Control<UserForm>;
	register: UseFormRegister<UserForm>;
	errors: FieldErrors<UserForm>;
};

const WaterMeters = ({ initialMeters = [], control, register, errors }: WaterMetersProps) => {
	// Initialize showMeters based on validation errors or initial meters
	const [showMeters, setShowMeters] = useState(
		initialMeters.length > 0 || (errors.meter_numbers && errors.meter_numbers.length! > 0) ? true : false
	);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "meter_numbers",
	});

	const handleToggleMeters = () => {
		setShowMeters(!showMeters);
	};

	const addMeter = () => {
		append({ value: "" });
	};

	const removeMeter = (index: number) => {
		remove(index);
	};

	return (
		<>
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Box display="flex">
					<WaterDropRoundedIcon color="info" />
					<Typography ml={1} variant="h6">
						Medidores de Agua (Opcional)
					</Typography>
				</Box>
				<Switch checked={showMeters} onChange={handleToggleMeters} />
			</Box>

			{showMeters && (
				<>
					<Box
						display="flex"
						sx={{
							flexDirection: { xs: "column", md: "row" },
							alignItems: { xs: "flex-start", md: "center" },
							mb: 2,
						}}
					>
						<MDButton
							variant="gradient"
							color="info"
							onClick={addMeter}
							sx={{ mb: { xs: 1, md: 0 }, mr: { md: 2 } }}
						>
							<AddRoundedIcon />
							&nbsp;Agregar Medidor
						</MDButton>
						<Typography component="span" variant="caption">
							Agregue uno o más medidores de agua asociados a este usuario
						</Typography>
					</Box>

					{fields.map((field, index) => (
						<Box key={field.id} display="flex" alignItems="center" mb={1}>
							<FormControl fullWidth variant="outlined" error={!!errors.meter_numbers?.[index]?.value}>
								<InputLabel htmlFor={`outlined-adornment-meter-${index}`}>
									Número de Medidor
								</InputLabel>
								<OutlinedInput
									id={`outlined-adornment-meter-${index}`}
									{...register(`meter_numbers.${index}.value`, {
										required: "Debe ingresar un número",
										pattern: {
											value: /^\d+$/,
											message: "Debe ser numérico",
										},
										validate: (value, formValues) => {
											const allMeters = formValues.meter_numbers?.map(m => m.value) || [];
											if (allMeters.filter(v => v === value).length > 1) {
												return "Medidor duplicado";
											}
											return true;
										}
									})}
									disabled={
										initialMeters[index] ? initialMeters[index].status : false
									}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												disableRipple
												aria-label="toggle meter"
												edge="end"
											>
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Número de Medidor"
								/>
								<FormHelperText>{errors.meter_numbers?.[index]?.value?.message}</FormHelperText>
							</FormControl>
							<IconButton
								disabled={
									initialMeters[index] ? initialMeters[index].status : false
								}
								onClick={() => removeMeter(index)}
								color="error"
								sx={{ ml: 1 }}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}
				</>
			)}
		</>
	);
};

export default WaterMeters;
