/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// index.tsx

import { forwardRef, type HTMLAttributes } from "react";
import MDBoxRoot from "./MDBoxRoot";

export type MDBoxProps = {
	variant?: "contained" | "gradient";
	bgColor?: string;
	color?: string;
	opacity?: number;
	borderRadius?: string;
	shadow?: string;
	coloredShadow?:
		| "primary"
		| "secondary"
		| "info"
		| "success"
		| "warning"
		| "error"
		| "light"
		| "dark"
		| "none";
} & HTMLAttributes<HTMLDivElement>;

const MDBox = forwardRef<HTMLDivElement, MDBoxProps>(
	(
		{
			variant = "contained",
			bgColor = "transparent",
			color = "dark",
			opacity = 1,
			borderRadius = "none",
			shadow = "none",
			coloredShadow = "none",
			...rest
		},
		ref
	) => (
		<MDBoxRoot
			{...rest}
			ref={ref}
			ownerState={{
				variant,
				bgColor,
				color,
				opacity,
				borderRadius,
				shadow,
				coloredShadow,
			}}
		/>
	)
);

export default MDBox;
