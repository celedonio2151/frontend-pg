import { Chip, Stack } from "@mui/material";
import React from "react";

export default function MDChip({ label, icon, color }) {
	return (
		<Stack spacing={1} alignItems="left">
			<Stack direction="row" spacing={1}>
				<Chip label={label} icon={icon} sx={{ minWidth: 105 }} color={color} />
			</Stack>
		</Stack>
	);
}
