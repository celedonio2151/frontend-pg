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

// @mui material components
// MDBoxRoot.ts

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { type Theme } from "@mui/material/styles";

type OwnerState = {
	variant?: "contained" | "gradient";
	bgColor?: string;
	color?: string;
	opacity?: number;
	borderRadius?: string;
	shadow?: string;
	coloredShadow?: string;
};

export default styled(Box, {
	shouldForwardProp: (prop) => prop !== "ownerState",
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => {
	const { palette, functions, borders, boxShadows } = theme as Theme;
	const {
		variant,
		bgColor,
		color,
		opacity,
		borderRadius,
		shadow,
		coloredShadow,
	} = ownerState;

	const { gradients, grey, white } = palette as any;
	const { linearGradient } = functions;
	const { borderRadius: radius } = borders;
	const { colored } = boxShadows;

	const greyColors: Record<string, string> = {
		"grey-100": grey[100],
		"grey-200": grey[200],
		"grey-300": grey[300],
		"grey-400": grey[400],
		"grey-500": grey[500],
		"grey-600": grey[600],
		"grey-700": grey[700],
		"grey-800": grey[800],
		"grey-900": grey[900],
	};

	const validGradients = [
		"primary",
		"secondary",
		"info",
		"success",
		"warning",
		"error",
		"dark",
		"light",
	];
	const validColors = [
		"transparent",
		"white",
		"black",
		"primary",
		"secondary",
		"info",
		"success",
		"warning",
		"error",
		"light",
		"dark",
		"text",
		...Object.keys(greyColors),
	];
	const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
	const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];

	// Background
	let backgroundValue = bgColor;

	if (variant === "gradient" && bgColor && validGradients.includes(bgColor)) {
		backgroundValue = linearGradient(
			gradients[bgColor].main,
			gradients[bgColor].state
		);
	} else if (bgColor && validColors.includes(bgColor)) {
		backgroundValue = palette[bgColor]?.main || greyColors[bgColor];
	}

	// Color
	let colorValue = color;
	if (color && validColors.includes(color)) {
		colorValue = palette[color]?.main || greyColors[color];
	}

	// Border radius
	let borderRadiusValue = borderRadius;
	if (borderRadius && validBorderRadius.includes(borderRadius)) {
		borderRadiusValue = radius[borderRadius];
	}

	// Box shadow
	let boxShadowValue = "none";
	if (shadow && validBoxShadows.includes(shadow)) {
		boxShadowValue = boxShadows[shadow];
	} else if (coloredShadow && colored[coloredShadow]) {
		boxShadowValue = colored[coloredShadow];
	}

	return {
		opacity,
		background: backgroundValue,
		color: colorValue,
		borderRadius: borderRadiusValue,
		boxShadow: boxShadowValue,
	};
});
