import { useRef, useState } from "react";

import MDBox from "components/MDBox";
// @mui icons
import { IconButton } from "@mui/material";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import MDButton from "components/MDButton";

export default function MDTabMonth({
	months,
	handleMonthClick,
	selectedMonth,
	setSelectedMonth,
}) {
	const scrollContainerRef = useRef(null);
	const monthRefs = useRef([]);

	const scrollToMonth = (index) => {
		const monthButton = monthRefs.current[index];
		const container = scrollContainerRef.current;

		if (monthButton && container) {
			const buttonRect = monthButton.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();

			if (buttonRect.left < containerRect.left) {
				container.scrollBy({
					left: buttonRect.left - containerRect.left - 8,
					behavior: "smooth",
				});
			} else if (buttonRect.right > containerRect.right) {
				container.scrollBy({
					left: buttonRect.right - containerRect.right + 8,
					behavior: "smooth",
				});
			}
		}
	};
	const handleArrowClick = (direction) => {
		let newSelectedMonth = selectedMonth;
		if (direction === "left" && selectedMonth > 0) {
			newSelectedMonth = selectedMonth - 1;
		} else if (direction === "right" && selectedMonth < months.length - 1) {
			newSelectedMonth = selectedMonth + 1;
		}
		setSelectedMonth(newSelectedMonth);
		scrollToMonth(newSelectedMonth);
		handleMonthClick(newSelectedMonth);
	};
	return (
		<MDBox sx={{ display: "flex", backgroundColor: "" }}>
			<IconButton onClick={() => handleArrowClick("left")}>
				<SkipPreviousRoundedIcon />
			</IconButton>
			<MDBox
				spacing={2}
				ref={scrollContainerRef}
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					// margin: "0 auto",
					overflowX: "auto",
					"&::-webkit-scrollbar": {
						height: "8px",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#888",
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "#555",
					},
					flexGrow: 1,
				}}
			>
				{months.map((month, index) => (
					<MDBox
						key={month}
						ref={(el) => (monthRefs.current[index] = el)}
						sx={{ minWidth: 135, m: 0.5 }}
					>
						<MDButton
							variant="contained"
							color={selectedMonth === index ? "primary" : "white"}
							onClick={() => handleMonthClick(index)}
							sx={{ alignItems: "center" }}
							startIcon={<CalendarMonthRoundedIcon />}
							fullWidth
						>
							{month}
						</MDButton>
					</MDBox>
				))}
			</MDBox>
			<IconButton onClick={() => handleArrowClick("right")}>
				<SkipNextRoundedIcon />
			</IconButton>
		</MDBox>
	);
}
