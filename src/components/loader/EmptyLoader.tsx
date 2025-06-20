import { Stack, Typography, Button } from "@mui/material";

import CachedRoundedIcon from "@mui/icons-material/CachedRounded";

interface EmptyLoaderProps {
	title?: string;
	description?: string;
	icon?: any;
	onReload?: () => void;
	reloadLabel?: string;
}

export default function EmptyLoader({
	title = "No hay resultados.",
	description,
	icon = <CachedRoundedIcon />,
	onReload,
	reloadLabel = "Recargar",
}: EmptyLoaderProps) {
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			sx={{ width: "100%" }}
			spacing={1.5}
		>
			{icon}
			<Typography variant="h6" color="text.secondary" textAlign="center">
				{title}
			</Typography>

			{description && (
				<Typography variant="body2" color="text.disabled" textAlign="center">
					{description}
				</Typography>
			)}

			{onReload && (
				<Button
					variant="outlined"
					size="small"
					onClick={onReload}
					sx={{ mt: 1 }}
				>
					{reloadLabel}
				</Button>
			)}
		</Stack>
	);
}
