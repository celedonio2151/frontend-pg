import { useEffect, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

import {
	useMaterialUIController,
	setMiniSidenav,
	setOpenConfigurator,
} from "context";
import Footer from "examples/Footer";
import Sidenav from "examples/Sidenav";
// Images
import brandWhite from "assets/images/logos/logoAgua.svg";
import brandDark from "assets/images/logos/logoAgua.svg";
import sitemap from "routes/sitemap";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function MainLayout({ children }: PropsWithChildren) {
	const [controller, dispatch] = useMaterialUIController();
	const {
		miniSidenav,
		direction,
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

	return (
		<DashboardLayout>
			<div>
				<DashboardNavbar />
				<Sidenav
					color={sidenavColor}
					brand={
						(transparentSidenav && !darkMode) || whiteSidenav
							? brandDark
							: brandWhite
					}
					brandName="Agua Mosoj Llajta"
					routes={sitemap}
					onMouseEnter={handleOnMouseEnter}
					onMouseLeave={handleOnMouseLeave}
				/>
			</div>
			<div>{children}</div>
			<div>
				<Footer />
			</div>
		</DashboardLayout>
	);
}
