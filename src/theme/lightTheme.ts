import { createTheme } from "@mui/material/styles";
import { OverrideComponents } from "./components";
import { lightPalette } from "./palette";

const lightTheme = createTheme({
	palette: lightPalette,
	typography: {
		fontFamily: "Roboto, sans-serif",
	},
	components: OverrideComponents,
});

export default lightTheme;
