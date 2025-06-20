import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsIcon from "@mui/icons-material/Settings";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
// Material Dashboard 2 React themes
import theme from "assets/theme";
// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { useMaterialUIController, setOpenConfigurator } from "context";

// Pages
import { useAuthContext } from "context/AuthContext";

function App() {
	const { loading } = useAuthContext();

	const [controller, dispatch] = useMaterialUIController();
	const { direction, openConfigurator, darkMode } = controller;
	const { pathname } = useLocation();

	// Change the openConfigurator state
	const handleConfiguratorOpen = () =>
		setOpenConfigurator(dispatch, !openConfigurator);

	// Setting the dir attribute for the body element
	useEffect(() => {
		document.body.setAttribute("dir", direction);
	}, [direction]);

	// Setting page scroll to 0 when changing the route
	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.scrollingElement.scrollTop = 0;
	}, [pathname]);

	const configsButton = (
		<MDBox
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="3.25rem"
			height="3.25rem"
			bgColor="white"
			shadow="sm"
			borderRadius="50%"
			position="fixed"
			right="2rem"
			bottom="2rem"
			zIndex={99}
			color="dark"
			sx={{ cursor: "pointer" }}
			onClick={handleConfiguratorOpen}
		>
			<SettingsIcon />
		</MDBox>
	);

	if (loading) return <h2>Cargand...</h2>; // O cualquier loader
	return (
		<ThemeProvider theme={darkMode ? themeDark : theme}>
			<CssBaseline />
			{/* {layout === "dashboard" && (
				<>
					<Sidenav
						color={sidenavColor}
						brand={
							(transparentSidenav && !darkMode) || whiteSidenav
								? brandDark
								: brandWhite
						}
						brandName="Agua Mosoj Llajta"
						// routes={routes}
						routes={sitemap}
						onMouseEnter={handleOnMouseEnter}
						onMouseLeave={handleOnMouseLeave}
					/>
					</>
					)} */}
			<Configurator />
			{configsButton}
			<Outlet />
		</ThemeProvider>
	);
}

export default App;
