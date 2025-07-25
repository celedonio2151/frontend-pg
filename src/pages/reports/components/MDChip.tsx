import { Chip, Stack, type ChipProps } from "@mui/material";

export default function MDChip(props: ChipProps) {
	return (
		<Stack spacing={1} alignItems="flex-start">
			<Stack direction="row" spacing={1}>
				<Chip {...props} sx={{ minWidth: 105, ...props.sx }} />
			</Stack>
		</Stack>
	);
}
