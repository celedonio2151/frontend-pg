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

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface LineChartProps {
	lineChartData: ApexAxisChartSeries;
	lineChartOptions: ApexOptions;
}

const LineChart: React.FC<LineChartProps> = ({
	lineChartData,
	lineChartOptions,
}) => {
	// Estado para los datos y opciones del gráfico
	const [chartData, setChartData] =
		useState<ApexAxisChartSeries>(lineChartData);
	const [chartOptions, setChartOptions] =
		useState<ApexOptions>(lineChartOptions);

	// Actualiza el estado si las props cambian
	useEffect(() => {
		setChartData(lineChartData);
		setChartOptions(lineChartOptions);
	}, [lineChartData, lineChartOptions]);

	return (
		<ReactApexChart
			options={chartOptions}
			series={chartData}
			type="area"
			width="100%"
			height="100%"
		/>
	);
};

export default LineChart;
