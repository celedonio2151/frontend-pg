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

import {
	useMaterialUIController,
	setMiniSidenav,
	setOpenConfigurator,
} from "context";

// Images
import brandWhite from "assets/images/logos/logoAgua.svg";
import brandDark from "assets/images/logos/logoAgua.svg";

// Pages
import { useAuthContext } from "context/AuthContext";
import sitemap from "routes/sitemap";

function App() {
	const { loading } = useAuthContext();

	const [controller, dispatch] = useMaterialUIController();
	const {
		miniSidenav,
		direction,
		layout,
		openConfigurator,
		sidenavColor,
		transparentSidenav,
		whiteSidenav,
		darkMode,
	} = controller;
	const [onMouseEnter, setOnMouseEnter] = useState(false);
	const { pathname } = useLocation();

	// Open sidenav when mouse enter on mini sidenav
	const handleOnMouseEnter = () => {
		if (miniSidenav && !onMouseEnter) {
			setMiniSidenav(dispatch, false);
			setOnMouseEnter(true);
		}
	};

	// Close sidenav when mouse leave mini sidenav
	const handleOnMouseLeave = () => {
		if (onMouseEnter) {
			setMiniSidenav(dispatch, true);
			setOnMouseEnter(false);
		}
	};

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
