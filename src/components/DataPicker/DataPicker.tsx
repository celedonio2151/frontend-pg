import { Card, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";

type Props = {
	date: Dayjs;
	handlerDateChange: (date: Dayjs) => void;
};

export default function DatePickerInput({ date, handlerDateChange }: Props) {
	return (
		<Card
			sx={{
				margin: "0 auto",
				px: 2,
				py: 2,
				minWidth: 300,
				maxWidth: 400,
				borderRadius: 2,
				backgroundColor: "background.paper",
				mb: 2,
			}}
		>
			<Typography
				variant="subtitle1"
				fontWeight="medium"
				mb={1}
				textAlign={"center"}
			>
				Seleccione una fecha o un año
			</Typography>

			<DatePicker
				format="DD MMMM YYYY"
				value={date}
				onChange={(newValue) => newValue && handlerDateChange(newValue)}
				slotProps={{
					textField: {
						fullWidth: true,
						variant: "outlined",
						// label: "Fecha de lectura",
						size: "small",
						InputProps: {
							sx: {
								// bgcolor: "whitesmoke",
								borderRadius: 2,
								fontWeight: "bold",
								py: 0.5,
							},
						},
					},
				}}
			/>
		</Card>
	);
}
