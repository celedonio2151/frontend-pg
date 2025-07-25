import { createTheme } from "@mui/material/styles";
import { OverrideComponents } from "./components";
import { darkPalette } from "./palette";

const darkTheme = createTheme({
	palette: darkPalette,
	typography: {
		fontFamily: "Roboto, sans-serif",
	},
	components: OverrideComponents,
});

export default darkTheme;
