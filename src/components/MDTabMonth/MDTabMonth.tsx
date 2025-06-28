import { useEffect, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MDButton from "components/MDButton";

type Props = {
	months: string[];
	selectedMonth: Date;
	handleMonthClick: (date: Date) => void;
};

export default function MDTabMonth({
	months,
	selectedMonth,
	handleMonthClick,
}: Props) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const monthRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const selectedIndex = selectedMonth.getMonth();

	const scrollToSelectedMonth = () => {
		const container = scrollContainerRef.current;
		const button = monthRefs.current[selectedIndex];

		if (container && button) {
			const offset =
				button.offsetLeft -
				container.offsetLeft -
				container.clientWidth / 2 +
				button.clientWidth / 2;

			container.scrollTo({
				left: offset,
				behavior: "smooth",
			});
		}
	};

	const handleArrowClick = (direction: "left" | "right") => {
		let newIndex = selectedIndex;

		if (direction === "left" && newIndex > 0) newIndex--;
		else if (direction === "right" && newIndex < months.length - 1) newIndex++;

		const newDate = new Date(
			selectedMonth.getFullYear(),
			newIndex,
			selectedMonth.getDate()
		);

		handleMonthClick(newDate);
	};

	useEffect(() => {
		scrollToSelectedMonth();
	}, [selectedMonth]);

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			bgcolor="#ffffff"
			borderRadius={3}
			// boxShadow={10}
			paddingTop={1}
		>
			<IconButton onClick={() => handleArrowClick("left")} size="small">
				<SkipPreviousRoundedIcon />
			</IconButton>

			<Box
				ref={scrollContainerRef}
				sx={{
					display: "flex",
					overflowX: "auto",
					scrollBehavior: "smooth", // por si acaso
					scrollbarWidth: "thin",
					scrollbarColor: "#999 transparent",
					"&::-webkit-scrollbar": {
						height: 6,
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#999",
						borderRadius: 3,
					},
					flexGrow: 1,
				}}
			>
				{months.map((month, index) => {
					const isSelected = selectedMonth.getMonth() === index;
					return (
						<MDButton
							sx={{
								minWidth: 130,
								mx: 0.5,
								backgroundColor: "transparent",
								"&:hover": {
									backgroundColor: " rgba(216, 216, 216, 0.57)",
								},
							}}
							key={month}
							inputRef={(el: HTMLButtonElement | null) =>
								(monthRefs.current[index] = el)
							}
							variant={isSelected ? "gradient" : "outlined"}
							color={isSelected ? "primary" : "secondary"}
							onClick={() => {
								const newDate = new Date(
									selectedMonth.getFullYear(),
									index,
									selectedMonth.getDate()
								);
								handleMonthClick(newDate);
							}}
							fullWidth
							startIcon={<CalendarMonthRoundedIcon />}
						>
							{month}
						</MDButton>
					);
				})}
			</Box>

			<IconButton onClick={() => handleArrowClick("right")} size="small">
				<SkipNextRoundedIcon />
			</IconButton>
		</Box>
	);
}
