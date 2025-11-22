import { useState, useEffect } from "react";
import {
	Switch,
	IconButton,
	Icon,
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

type WaterMetersProps = {
	initialMeters?: string[];
	onChange: (meters: string[]) => void;
};

const WaterMeters = ({ initialMeters = [], onChange }: WaterMetersProps) => {
	const [showMeters, setShowMeters] = useState(false);
	const [meters, setMeters] = useState<string[]>(
		initialMeters.length > 0 ? initialMeters : [""]
	);
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const newErrors: string[] = new Array(meters.length).fill("");
		const seenMeters = new Map<string, number>();

		meters.forEach((meter, index) => {
			const trimmedMeter = meter.trim();
			if (trimmedMeter === "") return;

			if (!/^\d+$/.test(trimmedMeter)) {
				newErrors[index] = "Debe ser numérico";
			} else {
				if (seenMeters.has(trimmedMeter)) {
					const firstIndex = seenMeters.get(trimmedMeter)!;
					newErrors[index] = "Medidor duplicado";
					if (newErrors[firstIndex] === "") {
						newErrors[firstIndex] = "Medidor duplicado";
					}
				} else {
					seenMeters.set(trimmedMeter, index);
				}
			}
		});

		setErrors(newErrors);
		onChange(meters.filter((meter) => meter.trim() !== ""));
	}, [meters, onChange]);

	const handleToggleMeters = () => {
		setShowMeters(!showMeters);
	};

	const addMeter = () => {
		setMeters([...meters, ""]);
	};

	const removeMeter = (index: number) => {
		const newMeters = meters.filter((_, i) => i !== index);
		if (newMeters.length === 0) {
			setMeters([""]);
		} else {
			setMeters(newMeters);
		}
	};

	const handleMeterChange = (index: number, value: string) => {
		const newMeters = [...meters];
		newMeters[index] = value;
		setMeters(newMeters);
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

					{meters.map((meter, index) => (
						<Box key={index} display="flex" alignItems="center" mb={1}>
							<FormControl fullWidth variant="outlined" error={!!errors[index]}>
								<InputLabel htmlFor={`outlined-adornment-meter-${index}`}>
									Número de Medidor
								</InputLabel>
								<OutlinedInput
									id={`outlined-adornment-meter-${index}`}
									value={meter}
									onChange={(e) => handleMeterChange(index, e.target.value)}
									endAdornment={
										<InputAdornment position="end">
											<IconButton aria-label="toggle meter" edge="end">
												<SpeedRoundedIcon />
											</IconButton>
										</InputAdornment>
									}
									label="Número de Medidor"
								/>
								<FormHelperText>{errors[index]}</FormHelperText>
							</FormControl>
							<IconButton
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
