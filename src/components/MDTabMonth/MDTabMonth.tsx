import { useEffect, useRef, useState } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
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


	// Calcula fecha segura (evita 31/febrero, etc.)
	const getSafeDate = (year: number, month: number, day: number) => {
		const lastDay = new Date(year, month + 1, 0).getDate();
		const safeDay = Math.min(day, lastDay);
		return new Date(year, month, safeDay);
	};

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

		const newDate = getSafeDate(
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
			paddingTop={1}
			sx={{
				width: "100%",
				overflow: "hidden",
			}}
		>
			<IconButton
				onClick={() => handleArrowClick("left")}
				size="small"
				aria-label="Mes anterior"
			>
				<SkipPreviousRoundedIcon />
			</IconButton>

			<Box
				ref={scrollContainerRef}
				sx={{
					display: "flex",
					overflowX: "auto",
					scrollBehavior: "smooth",
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
					px: 1,
				}}
			>
				{months.map((month, index) => {
					const isSelected = selectedIndex === index;
					return (
						<MDButton
							sx={{
								minWidth: 130,
								mx: 0.5,
								backgroundColor: "transparent",
								"&:hover": {
									backgroundColor: "rgba(216, 216, 216, 0.57)",
								},
								// whiteSpace: "nowrap",
								// flexShrink: 0,
							}}
							key={month}
							ref={(el: HTMLButtonElement | null) =>
								(monthRefs.current[index] = el)
							}
							variant={isSelected ? "gradient" : "outlined"}
							color={isSelected ? "primary" : "secondary"}
							onClick={() => {
								const newDate = getSafeDate(
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

			<IconButton
				onClick={() => handleArrowClick("right")}
				size="small"
				aria-label="Mes siguiente"
			>
				<SkipNextRoundedIcon />
			</IconButton>
		</Box>
	);
}
