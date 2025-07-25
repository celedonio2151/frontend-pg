// import { Theme } from '@mui/material';
import { ThemeProvider, type Theme } from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import darkTheme from "theme/darkTheme";
import lightTheme from "theme/lightTheme";

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
	currentTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextProps>({
	theme: lightTheme,
	toggleTheme: () => {},
	currentTheme: "light",
});

const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(() => {
		const storedTheme = localStorage.getItem("theme");
		return storedTheme === "dark" ? "dark" : "light";
	});

	const theme = currentTheme === "light" ? lightTheme : darkTheme;

	useEffect(() => {
		localStorage.setItem("theme", currentTheme);
	}, [currentTheme]);

	const toggleTheme = () => {
		setCurrentTheme(currentTheme === "light" ? "dark" : "light");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeContext.Provider>
	);
};

const useTheme = () => useContext(ThemeContext);

export { ThemeContextProvider, useTheme };
