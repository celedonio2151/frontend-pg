import { Box, Card, Divider, Stack, Typography } from "@mui/material";

interface Props {
	color?: string;
	bgColor: string;
	icon: React.ReactNode;
	title: string;
	value: number;
}

export function SummaryCard({ bgColor, color, icon, title, value }: Props) {
	return (
		<Card sx={{ bgcolor: bgColor, p: 0, minWidth: 200, justifyContent: "center" }}>
			<Stack
				p={1}
				direction="row"
				spacing={1}
				justifyContent={"space-around"}
				alignItems="center"
			>
				{icon}
				<Divider orientation="vertical" />
				<Box>
					<Typography variant="body1" color={color}>
						{title}
					</Typography>
					<Typography variant="body2" color={color}>
						Total: {value}
					</Typography>
				</Box>
			</Stack>
		</Card>
	);
}
