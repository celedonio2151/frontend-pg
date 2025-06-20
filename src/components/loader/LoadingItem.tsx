import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

interface Props {
	title?: string;
}

export default function LoadingItem({ title = "Cargando..." }: Props) {
	return (
		<Stack alignItems="center" justifyContent="center" width={1} padding={2}>
			<CircularProgress />
			{title && (
				<Typography variant="h6" color="text.secondary">
					{title}
				</Typography>
			)}
		</Stack>
	);
}
