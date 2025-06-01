import { Box, Skeleton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

type Props = {
	title: string;
	rows?: number;
};

export default function MDTableLoading({ title, rows = 5 }: Props) {
	return (
		<MDBox sx={{ m: 2 }}>
			<MDTypography component="h4" variant="body">
				{title}
			</MDTypography>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<Box key={rowIndex} sx={{ display: "flex" }}>
					<Skeleton
						variant="rounded"
						// animation="wave"
						// width={100} // Adjust as needed
						height={40} // Adjust as needed
						sx={{ flex: 1, mb: 1 }} // Use flexbox to distribute width evenly
					/>
				</Box>
			))}
		</MDBox>
	);
}
