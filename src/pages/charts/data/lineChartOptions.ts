/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import type { ApexOptions } from "apexcharts";
export const lineChartOptionsDashboard: ApexOptions = {
	chart: {
		toolbar: {
			show: false,
		},
	},
	tooltip: {
		theme: "dark",
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		curve: "smooth",
	},
	xaxis: {
		type: "category",
		categories: [
			"Ene",
			"Feb",
			"Mar",
			"Abr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		labels: {
			style: {
				colors: "#c8cfca",
				fontSize: "10px",
			},
		},
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
	},
	yaxis: {
		labels: {
			style: {
				colors: "#c8cfca",
				fontSize: "10px",
			},
		},
	},
	legend: {
		show: false,
	},
	grid: {
		strokeDashArray: 5,
		borderColor: "#56577A",
	},
	fill: {
		type: "gradient",
		gradient: {
			shade: "dark",
			type: "vertical",
			shadeIntensity: 0,
			gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
			inverseColors: true,
			opacityFrom: 0.8,
			opacityTo: 0,
			stops: [],
		},
		colors: ["#0075FF", "#2CD9FF"],
	},
	colors: ["#0075FF", "#2CD9FF"],
};
