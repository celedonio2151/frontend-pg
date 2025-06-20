import { Stack, Typography } from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
interface ErrorLoaderProps {
	title?: string;
	description?: string;
	icon?: any;
}
export default function ErrorLoader({
	title,
	description,
	icon = <ErrorRoundedIcon color="error" />,
}: ErrorLoaderProps) {
	return (
		<Stack
			direction="column"
			justifyContent="center"
			alignItems="center"
			padding={2}
			sx={{ height: 300, width: "100%" }}
		>
			{icon}
			<Typography variant="h6" color="error" mt={1}>
				{title || "Error"}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{description || "Intenta de nuevo más tarde."}
			</Typography>
		</Stack>
	);
}
